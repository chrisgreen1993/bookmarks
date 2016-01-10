import React, {Component} from 'react';
import {Link} from 'react-router';

class Login extends Component {
  render() {
    return (
      <div>
        <form className="ui large form">
          <div className="ui stacked segment">
            <div className="field">
              <input type="text" name="email" placeholder="Email" />
            </div>
            <div className="field">
              <input type="password" name="password" placeholder="Password" />
            </div>
            <button className="ui fluid primary button">Log In</button>
          </div>
        </form>
        <div className="ui center aligned segment">
          New here? <Link to="/register">Register</Link>
        </div>
      </div>
    );
  }
}

export default Login;
