import { PureComponent } from 'react';
import { getPostsFromIDB } from '../helpers/indexedDB';
import { sortPosts } from '../helpers/sort';

export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      posts: null
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    let posts = [];

    if ('indexedDB' in window) {
      getPostsFromIDB('posts').then((data) => {
        posts.push(data)
        console.log(posts)
        posts = data.length > 0 ? posts[0].reverse() : posts;
        this.setState({ posts, loaded: true });
      })
    }

    const FirebaseREST = require('firebase-rest').default;
    let jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com');
    jsonClient.get('/posts').then(res => {
      posts = [];
      posts = Object.values(res.body).sort(sortPosts);

      this.setState({ posts, loaded: true });

    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.posts, this.state.loaded)
  }

}
