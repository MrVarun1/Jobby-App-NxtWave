import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

export default withRouter(function Header(props) {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    return history.replace('/login')
  }

  return (
    <div className="navbar_container">
      <div className="logo_container">
        <Link to="/">
          <img
            alt="website logo"
            className="navbar_logo_img"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
      </div>
      <div className="nav_links_container">
        <Link className="link_styles" to="/">
          Home
        </Link>
        <Link className="link_styles" to="/jobs">
          Jobs
        </Link>
      </div>
      <div className="logout_button_container">
        <button type="button" className="jobby_btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
})
