const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()

const TweetAccessor = require('../model/tweet.model')
const UserAccessor = require('../model/user.model')

router.post('/', (req, res) => {
  const data = req.body
  if (!mongoose.Types.ObjectId.isValid(data.userId)) {
    res.status(404).send('User Id is invalid')
  }
  // search whether the username and password exit in mongodb
  UserAccessor.findUserById(data.userId).then( 
    user => {
      if(user) {
        TweetAccessor.insertTweet(data).then(
          (response) => {
            res.status(200).send(response)
          },
          (error) => res.status(404).send(`Error finding User:${error}`),
      )
      } else {
        res.status(404).send('Cannot find this user')
      }
    }
  ).catch((error) => console.log(error))


})

router.get('/all', (req, res) => {
  TweetAccessor.getAllTweet().then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/user/:userId', (req, res) => {
  TweetAccessor.findTweetByUserId(req.params.userId).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/:tweetId', (req, res) => {
  TweetAccessor.findTweetById(req.params.tweetId).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.delete('/:tweetId', (req, res) => {
  // check if the you are the one who post the tweet
  if (!mongoose.Types.ObjectId.isValid(req.params.tweetId)) {
    res.status(404).send('Tweet Id is invalid')
  }
  TweetAccessor.findTweetById(req.params.tweetId).then(tweet => {
    if(tweet) {
      if(tweet.userId !== req.body.userId) res.status(404).send("Yout don't have the permission to delete other user's post")
      else {
        TweetAccessor.deleteTweetById(req.params.tweetId).then(
          (response) => res.status(200).send(response),
          (error) => res.status(404).send(`Error finding User:${error}`),
      )
      }
    } else {
      res.status(404).send('Cannot find this tweet')
    }
  })
})

router.put('/:tweetId', (req, res) => {
 // check if the you are the one who post the tweet
 if (!mongoose.Types.ObjectId.isValid(req.params.tweetId)) {
  res.status(404).send('Tweet Id is invalid')
}
TweetAccessor.findTweetById(req.params.tweetId).then(tweet => {
  if(tweet) {
    if(tweet.userId !== req.body.userId) res.status(404).send("Yout don't have the permission to edit other user's post")
    else {
      TweetAccessor.updateTweetById(req.params.tweetId, req.body).then(
        (response) => res.status(200).send(response),
        (error) => res.status(404).send(`Error finding User:${error}`),
    )
    }
  } else {
    res.status(404).send('Cannot find this tweet')
  }
})
  
})

module.exports = router
