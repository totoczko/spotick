import { PureComponent } from 'react';
import { auth } from '../helpers/firebase';

export default class UserPostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
      likes: [],
      posts: []
    }
  }

  componentDidMount() {
    this.authFirebaseListener = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          this.getPosts(token);
        });
      }
    });
  }

  getPosts = (token) => {
    const FirebaseREST = require('firebase-rest').default;
    var jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com', { auth: token });
    const user_id = this.props.user.uid;
    let posts = [];
    let likes = [];
    jsonClient.get('/posts').then(res => {
      for (let postKey in res.body) {
        if (res.body[postKey].user.id === user_id) {
          posts.push(res.body[postKey]);
        }
        if (res.body[postKey].likes.users) {
          if (res.body[postKey].likes.users.indexOf(user_id) >= 0) {
            likes.push(res.body[postKey]);
          }
        }
      }
      posts.reverse();
      likes.reverse();
      this.setState({ posts, likes, status: 'loaded' })
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.posts, this.state.likes, this.state.status)
  }

}
