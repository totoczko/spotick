import { PureComponent } from 'react';
import firebase from '../helpers/firebase';


export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
      post: null
    }
  }

  componentDidMount() {
    this.getPost();
  }

  getPost = () => {
    const { id } = this.props;
    const postRef = firebase.database().ref('posts/' + id);
    let post = [];

    postRef.on('value', (snapshot) => {
      post = snapshot.val();
      this.setState({ post, status: 'loaded' })
    });
  }

  render() {
    return this.props.children(this.state.post, this.state.status)
  }

}
