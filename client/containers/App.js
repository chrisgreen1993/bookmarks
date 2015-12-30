import React from 'react';
import {connect} from 'react-redux';
import NavBar from '../components/NavBar';
import AddBookmark from '../components/AddBookmark';
import BookmarkList from '../components/BookmarkList';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <AddBookmark />
        <BookmarkList />
      </div>
    );
  }
}

function select(state) {
  return {state};
}

export default connect(select)(App);
