import React, {Component} from 'react';

class NavBar extends Component {
  render() {
    return (
      <div className="ui large fixed menu">
        <div className="ui container">
          <div className="header item">
            Bookmarks
          </div>
          <div className="right menu">
            <div className="item">
              <button className="ui primary button">Log Out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
