import { PureComponent } from 'react';
import { getPostsFromIDB } from '../helpers/indexedDB';
import { sortPosts } from '../helpers/sortPosts'

export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
      posts: null,
      lastPostLoaded: null,
      page: 1,
      loadingMore: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
    this.getPosts(3, null);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.page > this.state.page) {
      this.getPosts(4, this.state.lastPostLoaded);
    }
  }

  onScroll = () => {
    const { page } = this.state;
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 60) && !this.state.loadingMore) {
      const nextPage = page + 1;
      this.setState({ page: nextPage, loadingMore: true })
    }
  }

  getPosts = (limitToLast, endAt) => {
    let posts = this.state.posts ? this.state.posts : [];

    if ('indexedDB' in window) {
      getPostsFromIDB('posts').then((data) => {
        for (let post in data) {
          posts.push(data[post]);
        }
        posts = posts.reverse();
        this.setState({ posts, status: 'loaded' });
      })
    }

    const FirebaseREST = require('firebase-rest').default;
    let jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com');
    jsonClient.get('/posts', { orderBy: 'data', limitToLast: limitToLast, endAt: endAt ? endAt : '', initial: endAt ? true : false }).then(res => {
      if (!endAt) {
        posts = [];
      }
      for (let post in res.body) {
        posts.push(res.body[post]);
      }
      console.log(posts)
      let postsSorted = posts.sort(sortPosts)
      return postsSorted;
    }).then(posts => {
      const lastPostLoaded = posts[posts.length - 1].data;
      console.log(lastPostLoaded)
      this.setState({ posts, status: 'loaded', lastPostLoaded });
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.posts, this.state.status)
  }

}
