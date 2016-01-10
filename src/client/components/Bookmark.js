import React, {Component} from 'react';

class Bookmark extends Component {
  render() {
    return (
      <div className="card">
        <div className="content">
          <div className="header">Title</div>
          <a>http://url.com</a>
        </div>
        <div className="ui bottom attached buttons">
          <button className="ui button">Edit</button>
          <button className="ui button negative">Delete</button>
        </div>
      </div>
    );
  }
}

export default Bookmark;
