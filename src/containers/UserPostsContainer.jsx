import { PureComponent } from 'react';
import { auth } from '../helpers/firebase';
import { getPostsFromIDB } from '../helpers/indexedDB';

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
    const user_id = this.props.user.uid;
    let posts = [];
    let likes = [];
    const sortPosts = (a, b) => {
      const dateA = a.data;
      const dateB = b.data;
      let comparison = 0;
      if (dateA > dateB) {
        comparison = -1;
      } else if (dateA < dateB) {
        comparison = 1;
      }
      return comparison;
    }

    if ('indexedDB' in window) {
      getPostsFromIDB('posts').then((data) => {
        for (let post in data) {
          if (data[post].user.id === user_id) {
            posts.push(data[post]);
          }
          if (data[post].likes.users) {
            if (data[post].likes.users.indexOf(user_id) >= 0) {
              likes.push(data[post]);
            }
          }
        }

        posts = posts.reverse();
        likes = likes.reverse();
        this.setState({ posts, likes, status: 'loaded' });
      })
    }

    const FirebaseREST = require('firebase-rest').default;
    let jsonClient = new FirebaseREST.JSONClient('https://spot-pwa.firebaseio.com', { auth: token });

    jsonClient.get('/posts').then(res => {
      posts = [];
      likes = [];
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
      let itemsSorted = [];
      let postsSorted = posts.sort(sortPosts)
      let likesSorted = likes.sort(sortPosts)
      itemsSorted.push(postsSorted)
      itemsSorted.push(likesSorted)
      return itemsSorted;
    }).then(itemsSorted => {
      const posts = itemsSorted[0];
      const likes = itemsSorted[1];
      this.setState({ posts, likes, status: 'loaded' });
    }).catch(err => console.log(err))
  }

  render() {
    return this.props.children(this.state.posts, this.state.likes, this.state.status)
  }

}
