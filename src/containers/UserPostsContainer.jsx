import { PureComponent } from 'react';
import firebase from '../helpers/firebase';


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
    this.getPosts();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.user !== this.props.user) {
      this.getPosts();
    }
  }

  componentWillUnmount() {
    this.postsRef.off();
  }

  getPosts = () => {
    this.postsRef = firebase.database().ref('posts').orderByChild('data');
    const user_id = this.props.user.uid;
    let posts = [];
    let likes = [];
    this.postsRef.on('value', (snapshot) => {
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
      likes.reverse();
      this.setState({ posts, likes, status: 'loaded' })
    });
  }

  render() {
    return this.props.children(this.state.posts, this.state.likes, this.state.status)
  }

}
