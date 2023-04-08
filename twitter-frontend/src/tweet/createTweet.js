import { useState, useEffect } from 'react'
import './createTweet.css'
import * as actions from '../action/action'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actionTypes'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../config/config'

function CreateTweet(props) {
  const navigate = useNavigate()
  const [showpermission, setShowpermission] = useState(false)
  const [tweet, setTweet] = useState({
    caption: null,
    // file: null,
  })
  const [permission, setPermission] = useState(1)
  const [tweetimageURL, setTweetimageURL] = useState(null)
  const [postedTweet, setPostedTweet] = useState(null)

  useEffect(() => {
    if (postedTweet || !postedTweet) {
      setTimeout(() => setPostedTweet(null), 3000)
    }
  }, [postedTweet])

  const postTweet = (event) => {
    const button = document.querySelector('#tweetButton')
    button.disabled = true
    event.preventDefault()
    const tweetData = {
      userId: props.userId,
      content: tweet.caption,
      username: props.username,
      userImage: props.imageURL,
    }
    let url = baseUrl + '/api/tweet'
    axios({
      method: 'post',
      url: url,
      data: tweetData,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        button.disabled = false
        setPostedTweet(true)
        props.setPostTweet(true)
        // set the textarea to empty
        document.getElementById('postTweetBox').value = ''
      })
      .catch((err) => {
        setPostedTweet(false)
        button.disabled = false
      })
  }

  const setImage = () => {
    const imageurl = URL.createObjectURL(tweet.file)
    setTweetimageURL(imageurl)
  }

  const onImageChange = (event) => {
    console.log(event)
    setTweet({
      ...tweet,
      file: event.target.files[0],
    })
  }

  const handleNewTweet = (event) => {
    setTweet({
      ...tweet,
      caption: event.target.value,
    })
  }

  const handleKeyDown = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
    const limit = 100
    // In case you have a limitation
    e.target.style.height = `${Math.max(e.target.scrollHeight, limit)}px`
  }

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
          <img className="posterImage" src={props.imageURL} />
          <div className="tweetbox">
            <textarea
              placeholder="Share your story with others!"
              id="postTweetBox"
              className="tweetBox"
              onChange={handleNewTweet}
              onKeyDown={handleKeyDown}
              maxLength="250"
            />
            <img src={tweetimageURL} width="100%" />
          </div>
        </div>
        <div className="newtweetIcons">
          <button id="tweetButton" type="submit" onClick={postTweet}>
            Tweet
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    imageURL: state.imageURL,
    error: state.error,
    postedTweet: state.postedTweet,
    token: state.token,
    userId: state.userId,
    username: state.username,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitTweet: (tweet) => dispatch(actions.postTweet(tweet)),
    onResetPostedTweet: () =>
      dispatch({ type: actionTypes.RESET_POSTED_TWEET }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTweet)
