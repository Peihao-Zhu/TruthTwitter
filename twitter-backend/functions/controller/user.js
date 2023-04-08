const express = require('express')
const router = express.Router()

const UserAccessor = require('../model/user.model')

router.post('/signin', (req, res) => {
  const data = req.body
  //   console.log('sign in ' + data)
  // search whether the username and password exit in mongodb

  UserAccessor.findUser(data.username, data.password).then(
      (response) => {
        if (response === null) {
          res.status(404).send('username or password error')
        }
        // console.log('find user ' + response)
        else res.status(200).send(response)
      },
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.post('/signup', (req, res) => {
  // NOTE: because we're using Mongoose, it will
  // filter out any data that we DON'T want
  // So we can safely pass it the entire body
  const data = req.body
  if (!('profileImage' in data)) {
    data['profileImage'] =
      'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=996&t=st=1680413689~exp=1680414289~hmac=09994e8b8d18d554dfba6d1115b9aec238f478be6b79aa35dec2d618c9646573'
  }
  return UserAccessor.insertUser(data).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/all', function(req, res) {
  //   console.log('find all user')
  return UserAccessor.getAllUser().then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.get('/:userId', function(req, res) {
  //   console.log('find all user')
  return UserAccessor.findUserById(req.params.userId).then(
      (response) => res.status(200).send(response),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

router.put('/:userId/profile', function(req, res) {
  // console.log('update user ' + req.params.userId + ' ' + req.body.website)
  return UserAccessor.updateUserById(req.params.userId, req.body).then(
      () =>
        UserAccessor.findUserById(req.params.userId).then(
            (response) => res.status(200).send(response),
            (error) => res.status(404).send(`Error finding User:${error}`),
        ),
      (error) => res.status(404).send(`Error finding User:${error}`),
  )
})

module.exports = router
