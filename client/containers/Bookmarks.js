import React, {Component} from 'react';
import AddBookmark from '../components/AddBookmark';
import BookmarkList from '../components/Bookmark';

class Bookmarks extends Component {
  render() {
    return (
      <div>
        <AddBookmark />
        <BookmarkList />
      </div>
    );
  }
}

export default Bookmarks;
