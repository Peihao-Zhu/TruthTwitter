import { useState } from "react";
import "./post.css";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import * as actions from "../action/action";

const Post = (props) => {
  let date = new Date(props.datetime);
  const [tweetContent, setTweetContent] = useState(null);
  const [showEdit, setShowEdit] = useState(true);
  const setEditTweet = props.setEditTweet;
  const setDeleteTweet = props.setDeleteTweet;

  const navigate = useNavigate();
  const handleEdit = () => {
    setShowEdit(false);
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
            <div
              className="engageLink"
              onClick={() =>
                props.editPost(
                  props.post_id,
                  props.userId,
                  tweetContent,
                  setEditTweet,
                  navigate
                )
              }
            >
              <SaveOutlined />
              <p style={{ fontSize: "14px" }}>Save</p>
            </div>
          ) : null}

          <div
            className="engageLink"
            onClick={() =>
              props.deletePost(
                props.post_id,
                props.userId,
                setDeleteTweet,
                navigate
              )
            }
          >
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
    userId: state.userId,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authFail: (error) => dispatch(actions.authFail(error)),
    deletePost: (postId, userId, setDeleteTweet, navigate) => {
      dispatch(actions.deletePost(postId, userId, setDeleteTweet, navigate));
    },
    editPost: (postId, userId, tweetContent, setEditTweet, navigate) =>
      dispatch(
        actions.editPost(postId, userId, tweetContent, setEditTweet, navigate)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
