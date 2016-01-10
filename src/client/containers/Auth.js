import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

class Auth extends Component {
  render() {
    const {user, dispatch} = this.props;
    return (
      <div className="ui grid centered container">
        <div className="six wide computer ten wide tablet sixteen wide mobile column">
          <h1 className="ui center aligned header blue">Bookmarks</h1>
            {React.cloneElement(this.props.children, {user, dispatch})}
        </div>
      </div>
    );
  }
}

Auth.propTypes = {
  children: PropTypes.element.isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(Immutable.Map),
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}


export default connect(mapStateToProps)(Auth);
