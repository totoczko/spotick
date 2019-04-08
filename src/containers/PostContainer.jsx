import { PureComponent } from 'react';
import { auth } from '../helpers/firebase';
import { getPostsFromIDB } from '../helpers/indexedDB';

export default class PostContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      post: null
    }
  }

  componentDidMount() {
    this.authFirebaseListener = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          this.getPost(token);
        });
      }
    });
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
  }

  getPost = (token) => {
    const { id } = this.props;
    let post;
    if ('indexedDB' in window) {
      getPostsFromIDB('posts').then((data) => {
        for (let postKey in data) {
          if (data[postKey].id === id) {
            post = data[postKey];
          }
        }
        this.setState({ post, loaded: true });
      })
    }

    const FirebaseREST = require('firebase-rest').default;
    const jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com', { auth: token });
    jsonClient.get('/posts/' + id).then(res => {
      post = res.body;
      this.setState({ post, loaded: true });
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.post, this.state.loaded)
  }

}
