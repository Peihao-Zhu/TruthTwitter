import React from "react";
import { Link } from "react-router-dom";
import "./profileDropDown.css";
import { connect } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import * as actions from "../action/action";

const ProfileDropdown = (props) => {
  return (
    <div className="profileDropdown">
      <>
        <Link className="dropdownLink" to={`/user/${props.userId}`}>
          <UserOutlined />
          My Profile
        </Link>
        <Link to="/profile" className="dropdownLink">
          <SettingOutlined />
          Setting
        </Link>
      </>
      <Link to="/" className="dropdownLink logout" onClick={props.logout}>
        <LogoutOutlined />
        Logout
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDropdown);
