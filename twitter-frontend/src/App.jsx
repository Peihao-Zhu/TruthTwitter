import './App.css'
import LoginPage from './signin/login.js'
import Signup from './signup/signup'
import Navigation from './header/navbar'
import HomePage from './home/home'
import Profile from './profile/profile'
import UpdateProfile from './profile/updateProfile'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import User from './user/user'
import { connect } from 'react-redux'

function App(props) {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {props.auth ? (
          <Route path="/signin" element={<Navigate to="/" />} />
        ) : (
          <Route path="/signin" element={<LoginPage />} />
        )}
        {props.auth ? (
          <Route path="/signup" element={<Navigate to="/" />} />
        ) : (
          <Route path="/signup" element={<Signup />} />
        )}

        {props.auth ? (
          <Route path="/profile" element={<Profile />} />
        ) : (
          <Route path="/profile" element={<Navigate to="/signin" />} />
        )}

        {props.auth ? (
          <Route path="/updateprofile" element={<UpdateProfile />} />
        ) : (
          <Route path="/updateprofile" element={<Navigate to="/signin" />} />
        )}
        <Route path="/user/:user_id" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refresh: () => dispatch({ type: 'REFRESH' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
