import { PureComponent } from 'react';
import { getPostsFromIDB } from '../helpers/indexedDB';

export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
      posts: null
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    let posts = [];
    const sortPosts = (a, b) => {
      const dateA = a.data;
      const dateB = b.data;
      let comparison = 0;
      if (dateA > dateB) {
        comparison = -1;
      } else if (dateA < dateB) {
        comparison = 1;
      }
      return comparison;
    }

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
    var jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com');
    jsonClient.get('/posts').then(res => {
      posts = [];
      for (let post in res.body) {
        posts.push(res.body[post]);
      }
      let postsSorted = posts.sort(sortPosts)
      return postsSorted;

    }).then(posts => {
      this.setState({ posts, status: 'loaded' });
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.posts, this.state.status)
  }

}
