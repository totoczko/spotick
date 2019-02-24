import { PureComponent } from 'react';
import firebase from '../helpers/firebase';


export default class PostsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'loading',
      likes: [],
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
    let likes = [];
    postsRef.on('value', (snapshot) => {
      snapshot.forEach((child) => {
        if (child.val().user.id === user_id) {
          posts.push(child.val());
        }
        if (child.val().likes.users) {
          if (child.val().likes.users.indexOf(user_id) >= 0) {
            likes.push(child.val());
          }
        }
      })
      posts.reverse();
      this.setState({ posts, likes, status: 'loaded' })
    });
  }

  render() {
    return this.props.children(this.state.posts, this.state.likes, this.state.status)
  }

}
