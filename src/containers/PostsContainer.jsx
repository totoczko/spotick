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
    if ('indexedDB' in window) {
      getPostsFromIDB('posts').then((data) => {
        console.log('from cache')
        for (let post in data) {
          posts.push(data[post]);
          this.setState({ posts, status: 'loaded' });
        }
      })
    }

    console.log('from network')
    const FirebaseREST = require('firebase-rest').default;
    var jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com');
    jsonClient.get('/posts').then(res => {
      posts = [];
      for (let post in res.body) {
        posts.push(res.body[post]);
      }
      posts.reverse();
      this.setState({ posts, status: 'loaded' });
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.posts, this.state.status)
  }

}
