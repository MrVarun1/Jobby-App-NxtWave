import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

export default class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    displayErrorMsg: false,
    loginErrorMsg: '',
    isLoading: false,
  }

  onUsernameChange = event => {
    this.setState({usernameInput: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({passwordInput: event.target.value})
  }

  renderUsernameInputEle = () => {
    const {usernameInput} = this.state

    return (
      <div className="input_container">
        <label htmlFor="usernameInputEle" className="input_label">
          USERNAME
        </label>
        <input
          id="usernameInputEle"
          placeholder="Enter Username"
          type="text"
          value={usernameInput}
          className="input_styles"
          onChange={this.onUsernameChange}
        />
      </div>
    )
  }

  renderPasswordInputEle = () => {
    const {passwordInput} = this.state

    return (
      <div className="input_container">
        <label htmlFor="passwordInputEle" className="input_label">
          PASSWORD
        </label>
        <input
          id="passwordInputEle"
          type="password"
          placeholder="Enter Password"
          value={passwordInput}
          className="input_styles"
          onChange={this.onPasswordChange}
        />
      </div>
    )
  }

  loginApi = async () => {
    this.setState({isLoading: true})
    const {history} = this.props
    const {usernameInput, passwordInput} = this.state
    const url = 'https://apis.ccbp.in/login'
    const credentials = {
      username: usernameInput,
      password: passwordInput,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
    }

    try {
      const response = await fetch(url, options)
      const jsonResponse = await response.json()
      if (response.ok) {
        Cookies.set('jwt_token', jsonResponse.jwt_token, {expires: 1})
        history.replace('/')
      } else {
        this.setState({
          displayErrorMsg: true,
          loginErrorMsg: jsonResponse.error_msg,
          isLoading: false,
        })
      }
    } catch (error) {
      this.setState({
        displayErrorMsg: true,
        loginErrorMsg: 'Something went wrong. Please try again later.',
        isLoading: false,
      })
    }
  }

  onFormSubmit = event => {
    event.preventDefault()
    this.loginApi()
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    const {displayErrorMsg, loginErrorMsg, isLoading} = this.state

    return (
      <div className="login_bg_container">
        <div className="card">
          <img
            alt="logo"
            className="logo_img"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <form onSubmit={this.onFormSubmit} className="form_styles">
            {this.renderUsernameInputEle()}
            {this.renderPasswordInputEle()}
            <button className="btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {displayErrorMsg && (
              <p className="login_error_msg">{loginErrorMsg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}
