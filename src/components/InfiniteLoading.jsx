
import React, { Component } from 'react'

export default class InfiniteLoading extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
      this.props.loadMorePosts();
    }
  }

  render() {
    return (
      <div onScroll={(e) => this.handleScroll(e)}>
        {this.props.children}
      </div>
    );
  }
}
