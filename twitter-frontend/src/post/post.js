import { useState } from "react";
import "./post.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { baseUrl } from "../config/config";

const Post = (props) => {
  let date = new Date(props.datetime);

  const [tweetContent, setTweetContent] = useState(null);
  const [showEdit, setShowEdit] = useState(true);

  const setDeleteTweet = props.setDeleteTweet;

  const setEditTweet = props.setEditTweet;

  const handleEdit = () => {
    console.log("edit");
    setShowEdit(false);
  };

  const handleSave = () => {
    console.log("save");
    const url = baseUrl + `/api/tweet/${props.post_id}`;
    const tweetData = {
      content: tweetContent,
      userId: props.userId,
    };
    axios({
      method: "put",
      url: url,
      data: tweetData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setEditTweet(true);
      })
      .catch((err) => {
        setEditTweet(false);
        // setError(true)
        // setLoading(false)
      });
  };

  const handleDelete = () => {
    const url = baseUrl + `/api/tweet/${props.post_id}`;
    const data = { userId: props.userId };
    axios({
      method: "delete",
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setDeleteTweet(true);
      })
      .catch((err) => {
        setDeleteTweet(false);
      });
  };

  const handleNewTweet = (event) => {
    setTweetContent(event.target.value);
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    const limit = 100;
    // In case you have a limitation
    e.target.style.height = `${Math.max(e.target.scrollHeight, limit)}px`;
  };

  return (
    <article className="post">
      <header className="postingDetails">
        <img
          className="posterImage"
          alt="avatar of poster"
          src={props.imageURL}
        />
        <div>
          <Link to={`/user/${props.postUserId}`} className="posterName">
            {props.postUsername}
          </Link>
          <p className="postingDate">
            {date.getDate()} {date.toLocaleString("en", { month: "long" })} at{" "}
            {date.getHours()}:{date.getMinutes()}
          </p>
        </div>
      </header>
      {/* edit mode */}
      {showEdit ? (
        <Link to={`/user/${props.postUserId}`} className="tweet">
          <p>{props.caption}</p>
        </Link>
      ) : null}
      {/* save mode */}
      {!showEdit ? (
        <textarea
          id={`postText_${props.key}}`}
          defaultValue={props.caption}
          className="tweetBoxEdit"
          onChange={handleNewTweet}
          onKeyDown={handleKeyDown}
          maxLength="250"
        ></textarea>
      ) : null}

      {props.tweetFileURL ? (
        <img src={props.tweetFileURL} className="tweetFile" alt="tweet file" />
      ) : null}
      {props.from === "user" && props.postUserId === props.userId ? (
        <div className="engageButtons">
          {showEdit ? (
            <div className="engageLink" onClick={handleEdit}>
              <EditOutlined />
              <p style={{ fontSize: "14px" }}>Edit</p>
            </div>
          ) : null}

          {!showEdit ? (
            <div className="engageLink" onClick={handleSave}>
              <SaveOutlined />
              <p style={{ fontSize: "14px" }}>Save</p>
            </div>
          ) : null}

          <div className="engageLink" onClick={handleDelete}>
            <DeleteOutlined />
            <p style={{ fontSize: "14px" }}>Delete</p>
          </div>
        </div>
      ) : null}
    </article>
  );
};

const mapStateToProps = (state) => {
  return {
    // imageURL: state.imageURL,
    // username: state.username,
    userId: state.userId,
    error: state.error,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deletePost: () => dispatch({ type: "TWEET_DELETE" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
