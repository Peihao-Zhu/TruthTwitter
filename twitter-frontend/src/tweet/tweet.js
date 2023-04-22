import Post from '../post/post'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { baseUrl } from '../config/config'
import { Spin } from 'antd'
import './tweet.css'

function Tweets(props) {
  const [tweets, setTweets] = useState([
  ])
  const [deleteTweet, setDeleteTweet] = useState(null)
  const [editTweet, setEditTweet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // display the delete successfully or error message for 3 s
  useEffect(() => {
    if (deleteTweet || !deleteTweet) {
      setTimeout(() => setDeleteTweet(null), 3000)
    }
    if (editTweet || !editTweet) {
      setTimeout(() => setEditTweet(null), 3000)
    }
  }, [deleteTweet, editTweet])

  // question: always call twice!!!!?????
  useEffect(() => {
    setLoading(true)
    const userId = props.userId
    let url = baseUrl + `/api/tweet/all`
    if (userId !== null) {
      url = baseUrl + `/api/tweet/user/${userId}`
    }
    axios({
      method: 'get',
      url: url,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      //   Authorization: props.token,
      // },
    })
      .then((res) => {
        setTweets(res.data)
        setLoading(false)
        if (deleteTweet === true) {
          setDeleteTweet(null)
        }
        if (editTweet === true) {
          setEditTweet(null)
        }
        if (props.hasOwnProperty('setPostTweet')) {
          props.setPostTweet(false)
        }
      })
      .catch((err) => {
        setError(true)
        setLoading(false)
      })
  }, [props.userId, deleteTweet, props.postTweet, editTweet])

  function showMessage() {
    if (deleteTweet === true)
      return <p className="tweetSuccess">Tweet delete successfully.</p>
    else if (deleteTweet === false)
      return <p className="tweetFail">Tweet delete failed</p>
    else if (editTweet === true)
      return <p className="tweetSuccess">Tweet edit successfully.</p>
    else if (editTweet === false)
      return <p className="tweetFail">Tweet edit failed</p>
    return null
  }

  return (
    <section className="container">
      {showMessage()}
      {loading && (
        <div className="itemCenter">
          <Spin size="large" />
        </div>
      )}
      {error && (
        <p className="itemCenter">Sorry, an error occured. Please try again.</p>
      )}
      {!loading &&
        !error &&
        tweets.map((post, index) => (
          <Post
            key={index}
            postUsername={post.username}
            postUserId={post.userId}
            caption={post.content}
            imageURL={post.userImage}
            // comments={post.comments}
            // retweets={post.retweets}
            datetime={post.updatedAt}
            post_id={post._id}
            setDeleteTweet={setDeleteTweet}
            from={props.from}
            setEditTweet={setEditTweet}
            // liked={post.liked}
            // likes={post.likes}
            // retweeted={post.retweeted}
            // saved={post.saved}
          />
        ))}
      {!loading && !error && tweets.length === 0 && (
        <p style={{ display: 'flex', justifyContent: 'center' }}>
          No any post yet.
        </p>
      )}
    </section>
  )
}

const mapStateToProps = (state) => {
  return {
    imageURL: state.imageURL,
    username: state.username,
    token: state.token,
    getTweets: state.getTweets,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTweetSuccess: () => dispatch({ type: 'TWEET_SUCCESS' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tweets)
