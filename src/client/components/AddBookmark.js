import React, {Component} from 'react';

class AddBookmark extends Component {
  render() {
    return (
      <div className="ui segment">
        <form className="ui form">
          <div className="two fields">
            <div className="field">
              <input type="text" name="text" placeholder="Title" />
            </div>
            <div className="field">
              <input type="url" name="url" placeholder="URL" />
            </div>
            <button className="ui button positive">Save</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddBookmark;
