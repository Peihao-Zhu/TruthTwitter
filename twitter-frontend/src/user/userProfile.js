import "./userProfile.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { baseUrl } from "../config/config";

function UserProfile(props) {
  const [profile_image, setprofile_image] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  // a hook to access dynamic parameters in the URL
  const userId = props.userId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    setLoading(true);
    let url = baseUrl + `/api/user/${userId}`;
    axios
      .get(url)
      .then((response) => {
        setprofile_image(response.data.profileImage);
        setUsername(response.data.username);
        setBio(response.data.bio);
        const date = new Date(response.data.createDate);
        setFormattedDate(
          date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })
        );
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="profileCard">
      {loading && !error && <Spin />}
      {error && (
        <p style={{ display: "flex", justifyContent: "center" }}>
          Sorry, an error occured. Please try again.
        </p>
      )}
      {!loading && (
        <>
          <img className="profileImage" src={profile_image} />
          <div className="Bio">
            <div className="flexDisplay">
              <p className="userName">{username}</p>

              <p className="createDate">
                <ProfileOutlined />
                {" Joined " + formattedDate}
              </p>
              {/* <p className="stats">
                <span className="amount">{following}</span> following
              </p>
              <p className="stats">
                <span className="amount">{followers}</span> followers
              </p> */}
            </div>
            <p className="about">
              {bio === null || bio === ""
                ? "Hi man, please add something to your bio!"
                : bio}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
