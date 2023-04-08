const functions = require('firebase-functions')

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const express = require('express')
const user = require('./controller/user')
const tweet = require('./controller/tweet')
const mongoose = require('mongoose')

const app = express()

// This is the default address for MongoDB.
// Make sure MongoDB is running!
const mongoEndpoint =
  'mongodb+srv://jadenchu14:Zhupeihao123!@peihaomongo.onflnzf.mongodb.net/twitter?retryWrites=true&w=majority'
// useNewUrlParser is not required, but the old parser is deprecated
mongoose.connect(mongoEndpoint, { useNewUrlParser: true })

// Get the connection string
const db = mongoose.connection

// This will create the connection, and throw an error if it doesn"t work
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'))

// The next 2 lines are intercepting the request
// and make our request data more easily accessible
// to our code, before passing the request on
// to the next part of the code
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://peihao-twitter.web.app')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.use('/api/user', user)
app.use('/api/tweet', tweet)

// app.listen(process.env.PORT || 3080, () => {
//   console.log('Starting server')
// })
exports.app = functions.https.onRequest(app)
