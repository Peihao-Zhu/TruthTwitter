import './navbar.css'
import { Link, NavLink } from 'react-router-dom'
import { CarFilled } from '@ant-design/icons'
import React, { useState } from 'react'
import ProfileDropdown from '../profile/pofileDropDown'
import { connect } from 'react-redux'

function Navigation(props) {
  const [showDropdown, setshowDropdown] = useState(false)

  return (
    <header className="header">
      <Link to="/" className="homePage">
        <CarFilled style={{ fontSize: '50px' }} />
      </Link>
      <nav className="navBar">
        <NavLink className="navLink" to="/">
          Home
        </NavLink>
        {props.auth ? null : (
          <NavLink className="navLink" to="/signin">
            SignIn
          </NavLink>
        )}
        {props.auth ? null : (
          <NavLink className="navLink" to="/signup">
            SignUp
          </NavLink>
        )}
      </nav>
      <div className="userProfile">
        <div
          className="userSummary"
          onClick={() => setshowDropdown(props.auth ? !showDropdown : false)}
        >
          <img src={props.imageURL} className="userImage" alt="user profile " />
          <div className="username">{props.username}</div>
        </div>
        {showDropdown && props.auth ? <ProfileDropdown /> : null}
      </div>
    </header>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    imageURL: state.imageURL,
    username: state.username,
    error: state.error,
  }
}

export default connect(mapStateToProps, null)(Navigation)
