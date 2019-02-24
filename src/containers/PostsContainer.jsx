import { PureComponent } from 'react';
import firebase from '../helpers/firebase';


export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      posts: 'loading'
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    const postsRef = firebase.database().ref('posts');
    let posts = [];

    postsRef.on('value', (snapshot) => {
      snapshot.forEach((child) => {
        posts.push(child.val());
      })
      posts.reverse();
      this.setState({ posts })
    });
  }

  render() {
    return this.props.children(this.state.posts)
  }

}
