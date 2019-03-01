import { PureComponent } from 'react';
import firebase from '../helpers/firebase';


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

  componentWillUnmount() {
    this.postsRef.off();
  }

  getPosts = () => {
    this.postsRef = firebase.database().ref('posts').orderByChild('data');
    let posts = [];
    this.postsRef.on('value', (snapshot) => {
      snapshot.forEach((child) => {
        posts.push(child.val());
      })
      posts.reverse();
      this.setState({ posts, status: 'loaded' })
    });
  }

  render() {
    return this.props.children(this.state.posts, this.state.status)
  }

}
