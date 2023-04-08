import CreateTweet from '../tweet/createTweet'
import './home.css'
import Tweet from '../tweet/tweet'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'

function HomePage(props) {
  const [postTweet, setPostTweet] = useState(false)
  return (
    <div className="homeContainer">
      {props.auth ? <CreateTweet setPostTweet={setPostTweet} /> : null}
      <Tweet
        userId={null}
        postTweet={postTweet}
        setPostTweet={setPostTweet}
        from={'home'}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, null)(HomePage)
