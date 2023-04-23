import "./navbar.css";
import { Link, NavLink } from "react-router-dom";
import React, { useState } from "react";
import ProfileDropdown from "../profile/pofileDropDown";
import { connect } from "react-redux";
import logo from "../img/dog.jpg";
import { Input, AutoComplete } from "antd";
import { baseUrl } from "../config/config";
import axios from "axios";

function Navigation(props) {
  const [showDropdown, setshowDropdown] = useState(false);
  const [options, setOptions] = useState([]);

  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    searchResult(value).then((options) => {
      setOptions(options);
    });
  };

  const searchResult = (query) => {
    const url = baseUrl + `/api/user/search?keyword=${query}`;
    return axios({
      method: "get",
      url: url,
    }).then((res) => {
      return res.data.map((user, _) => {
        return {
          value: user.username,
          label: (
            <Link to={`/user/${user._id}`}>
              <div className="userSummary">
                <img
                  src={user.profileImage}
                  alt="user avatar"
                  className="userImage"
                />
                <div className="username">{user.username}</div>
              </div>
            </Link>
          ),
        };
      });
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
          <Input.Search size="large" placeholder="input here" enterButton />
        </AutoComplete>
      </div>
      <div
        className="userProfile"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="userSummary"
          // onClick={() => setshowDropdown(props.auth ? !showDropdown : false)}
        >
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

export default connect(mapStateToProps, null)(Navigation);
