import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import NavBar from '../components/NavBar';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="ui container" style={{paddingTop: '70px'}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

function mapStateToProps(state) {
  return {
    bookmarks: state.bookmarks,
    user: state.user,
  };
}


export default connect(mapStateToProps)(App);
