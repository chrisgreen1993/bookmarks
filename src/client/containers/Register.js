import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Immutable from 'immutable';
import {registerUser} from '../actions/user';

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {fields: Immutable.Map({email: '', password: ''})};
  }

  handleSubmit(e) {
    e.preventDefault();
    const {email, password} = this.state.fields.toJS();
    this.props.dispatch(registerUser(email, password));
  }

  handleChange(inputName, e) {
    this.setState(({fields}) => ({fields: fields.set(inputName, e.target.value)}));
  }

  renderErrors() {
    if (this.props.user.get('register_errors')) {
      // Render errors
    }
  }

  render() {
    return (
      <div>
        <form className="ui large form" onSubmit={this.handleSubmit}>
          <div className="ui stacked segment">
            <div className="field">
              <input
                type="email" name="email" placeholder="Email" required value={this.state.email}
                onChange={this.handleChange.bind(this, 'email')}
              />
            </div>
            <div className="field">
              <input
                type="password" name="password" placeholder="Password" value={this.state.password}
                onChange={this.handleChange.bind(this, 'password')}
              />
            </div>
            <button className="ui fluid primary button">Register</button>
          </div>
        </form>
        <div className="ui center aligned segment">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(Immutable.Map),
};

export default Register;
