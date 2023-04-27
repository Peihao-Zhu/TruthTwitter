import "./navbar.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import React, { useState } from "react";
import ProfileDropdown from "../profile/pofileDropDown";
import { connect } from "react-redux";
import logo from "../img/dog.jpg";
import { Input, AutoComplete } from "antd";
import * as actions from "../action/action";

function Navigation(props) {
  const [showDropdown, setshowDropdown] = useState(false);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    props.searchResult(value, navigate).then((options) => {
      setOptions(options);
    });
  };

  const handleMouseEnter = () => {
    setshowDropdown(props.auth ? true : false);
  };

  const handleMouseLeave = () => {
    setshowDropdown(false);
  };

  return (
    <header className="header">
      <Link to="/" className="homePage">
        <img src={logo} alt="website logo" width="=60" height="60" />
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
      <div className="searchBar">
        <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{ width: 300 }}
          options={options}
          onSearch={handleSearch}
        >
          <Input.Search
            size="large"
            placeholder="search user here"
            enterButton
          />
        </AutoComplete>
      </div>
      <div
        className="userProfile"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="userSummary">
          <img src={props.imageURL} className="userImage" alt="user profile " />
          <div className="username">{props.username}</div>
        </div>
        {showDropdown && props.auth ? <ProfileDropdown /> : null}
      </div>
    </header>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    imageURL: state.imageURL,
    username: state.username,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchResult: (query, navigate) =>
      dispatch(actions.searchResult(query, navigate)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
