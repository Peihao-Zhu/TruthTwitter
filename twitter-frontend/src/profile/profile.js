import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./profile.css";
import "../header/header.css";

function Profile(props) {
  return (
    <div className="editProfile">
      <p>Personal info</p>
      <div className="profileDetails">
        <div className="profileEditPrompt">
          <div>
            <p>Profile</p>
          </div>
          <Link to="/updateprofile">Edit</Link>
        </div>
        <div className="profileDiv">
          <p>Avatar</p>
          <img
            src={props.imageURL}
            alt="avatar of user"
            className="editProfileImage"
          />
        </div>
        <div className="profileDiv">
          <p>Name</p>
          <p>{props.username}</p>
        </div>
        <div className="profileDiv">
          <p>Bio</p>
          <p>{props.bio}</p>
        </div>
        <div className="profileDiv">
          <p>Email</p>
          <p>{props.email}</p>
        </div>
        {/* <div className="profileDiv">
          <p>Phone</p>
          <p>{props.phone}</p>
        </div> */}
        <div className="profileDiv">
          <p>Website</p>
          <a href={props.website}>{props.website}</a>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    imageURL: state.imageURL,
    bio: state.bio,
    username: state.username,
    email: state.email,
    error: state.error,
    message: state.message,
    phone: state.phone,
    website: state.website,
  };
};

export default connect(mapStateToProps, null)(Profile);
