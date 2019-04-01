import { PureComponent } from 'react';

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

  getPosts = (token) => {
    const FirebaseREST = require('firebase-rest').default;
    var jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com');
    let posts = [];
    jsonClient.get('/posts').then(res => {
      for (let post in res.body) {
        posts.push(res.body[post]);
      }
      posts.reverse();
      this.setState({ posts, status: 'loaded' });
    })
  }

  render() {
    return this.props.children(this.state.posts, this.state.status)
  }

}
