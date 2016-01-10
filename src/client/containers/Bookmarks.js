import React, {Component} from 'react';
import AddBookmark from '../components/AddBookmark';
import Bookmark from '../components/Bookmark';

class Bookmarks extends Component {
  render() {
    return (
      <div>
        <AddBookmark />
        <div className="ui three stackable cards">
          <Bookmark />
          <Bookmark />
          <Bookmark />
          <Bookmark />
        </div>
      </div>
    );
  }
}

export default Bookmarks;
