import { PureComponent } from 'react';
import { auth } from '../helpers/firebase';

export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
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

  getPost = (token) => {
    const { id } = this.props;
    const FirebaseREST = require('firebase-rest').default;
    var jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com', { auth: token });
    let post;
    jsonClient.get('/posts/' + id).then(res => {
      console.log(res)
      post = res.body;
      this.setState({ post, status: 'loaded' });
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.post, this.state.status)
  }

}
