import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

function select(state) {
  return {state};
}

export default connect(select)(App);
