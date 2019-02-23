import { PureComponent } from 'react';
import firebase from '../helpers/firebase';


export default class PostContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
      posts: []
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    const postsRef = firebase.database().ref('posts');
    const user_id = JSON.parse(localStorage.getItem('user_data')).uid;
    let posts = [];
    postsRef.on('value', (snapshot) => {
      snapshot.forEach((child) => {
        if (child.val().user.id === user_id) {
          posts.push(child.val());
        }
      })
      posts.reverse();
      this.setState({ posts, status: 'loaded' })
    });
  }

  render() {
    return this.props.children(this.state.posts, this.state.status)
  }

}
