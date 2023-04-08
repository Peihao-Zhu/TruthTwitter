const express = require('express')
const router = express.Router()

const TweetAccessor = require('../model/tweet.model')

router.post('/', (req, res) => {
  const data = req.body
  //   console.log('sign in ' + data)
  // search whether the username and password exit in mongodb

  TweetAccessor.insertTweet(data).then(
      (response) => {
        res.status(200).send(response)
      },
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/all', (req, res) => {
  //   console.log('sign in ' + data)
  // search whether the username and password exit in mongodb

  TweetAccessor.getAllTweet().then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/user/:userId', (req, res) => {
  //   console.log('sign in ' + data)
  // search whether the username and password exit in mongodb

  TweetAccessor.findTweetByUserId(req.params.userId).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/:tweetId', (req, res) => {
  //   console.log('sign in ' + data)
  // search whether the username and password exit in mongodb

  TweetAccessor.findTweetById(req.params.tweetId).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.delete('/:tweetId', (req, res) => {
  TweetAccessor.deleteTweetById(req.params.tweetId).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.put('/:tweetId', (req, res) => {
  //   console.log('sign in ' + data)
  // search whether the username and password exit in mongodb

  TweetAccessor.updateTweetById(req.params.tweetId, req.body).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

module.exports = router
