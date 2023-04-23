import { useState, useEffect } from "react";
import "./createTweet.css";
import * as actions from "../action/action";
import { connect } from "react-redux";
import * as actionTypes from "../store/actionTypes";
import axios from "axios";
import { baseUrl } from "../config/config";
import { FileImageOutlined } from "@ant-design/icons";

function CreateTweet(props) {
  const emptyTweet = {
    content: null,
    fileURL: null,
  };
  const [tweet, setTweet] = useState(emptyTweet);
  const [postedTweet, setPostedTweet] = useState(null);

  useEffect(() => {
    if (postedTweet || !postedTweet) {
      setTimeout(() => setPostedTweet(null), 3000);
    }
  }, [postedTweet]);

  const postTweet = (event) => {
    // we cannot publish empty post
    if (!tweet.content && !tweet.fileURL) return;
    const button = document.querySelector("#tweetButton");
    button.disabled = true;
    event.preventDefault();
    const tweetData = {
      userId: props.userId,
      content: tweet.content,
      username: props.username,
      userImage: props.imageURL,
      fileURL: tweet.fileURL,
    };
    let url = baseUrl + "/api/tweet";
    axios({
      method: "post",
      url: url,
      data: tweetData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        button.disabled = false;
        setPostedTweet(true);
        props.setPostTweet(true);
        // set the textarea to empty
        document.getElementById("postTweetBox").value = "";
        setTweet(emptyTweet);
      })
      .catch((err) => {
        setPostedTweet(false);
        button.disabled = false;
      });
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const now = new Date();
      const dateTimeString = now.getTime();
      const fileKey =
        "tweet/" +
        props.username +
        "/" +
        props.userId +
        "/" +
        dateTimeString +
        "_" +
        file.name;
      actions
        .uploadImgToAWSS3("twitter-user-image", fileKey, event.target.result)
        .then((result) => {
          setTweet({
            ...tweet,
            fileURL: result.Location,
          });
        })
        .catch((error) => console.log(error));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleNewTweet = (event) => {
    setTweet({
      ...tweet,
      content: event.target.value,
    });
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    const limit = 100;
    // In case you have a limitation
    e.target.style.height = `${Math.max(e.target.scrollHeight, limit)}px`;
  };

  return (
    <div className="container">
      {postedTweet === true ? (
        <p className="tweetSuccess">Tweet posted successfully.</p>
      ) : null}
      {postedTweet === false ? (
        <p className="tweetFail">An error occured.</p>
      ) : null}
      <div className="createTweet">
        <p>Tweeeeeeeeeet</p>
        <div className="newtweetInput">
          <img className="posterImage" src={props.imageURL} alt="user avatar" />
          <div className="tweetbox">
            <textarea
              placeholder="Share your story with others!"
              id="postTweetBox"
              className="tweetBox"
              onChange={handleNewTweet}
              onKeyDown={handleKeyDown}
              maxLength="250"
            />
            {tweet.fileURL !== null ? (
              <img
                src={tweet.fileURL}
                className="createTweetImage"
                alt="tweet file"
              />
            ) : null}
          </div>
        </div>
        <div className="newtweetIcons">
          <label htmlFor="file-input">
            <FileImageOutlined className="tweetImageIcon" />
          </label>
          <input
            type="file"
            accept="image"
            id="file-input"
            name="image-upload"
            onChange={onImageChange}
          />
          <button id="tweetButton" type="submit" onClick={postTweet}>
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    imageURL: state.imageURL,
    error: state.error,
    postedTweet: state.postedTweet,
    token: state.token,
    userId: state.userId,
    username: state.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitTweet: (tweet) => dispatch(actions.postTweet(tweet)),
    onResetPostedTweet: () =>
      dispatch({ type: actionTypes.RESET_POSTED_TWEET }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTweet);
