import { PureComponent } from 'react';
import firebase from 'helpers/firebase';


export default class PostContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    const postsRef = firebase.database().ref('posts');
    postsRef.on('value', (snapshot) => {
      const posts = snapshot.val();
      this.setState({ posts });
    });
  }

  render() {
    return this.props.children(this.state.posts)
  }

}
