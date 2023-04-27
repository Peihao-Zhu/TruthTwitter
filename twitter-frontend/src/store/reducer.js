import * as actionTypes from "./actionTypes";

let initialState = {
  auth: false,
  token: null,
  userId: null,
  loading: false,
  error: null,
  imageURL:
    "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=996&t=st=1680413689~exp=1680414289~hmac=09994e8b8d18d554dfba6d1115b9aec238f478be6b79aa35dec2d618c9646573",
  bio: null,
  username: "please log in...",
  successMessage: null,
  email: null,
  postedTweet: null,
  website: null,
  createdate: null,
  getTweets: false,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.token,
        auth: true,
        userId: action.userId,
        imageURL: action.imageURL,
        username: action.username,
        bio: action.bio,
        email: action.email,
        website: action.website,
        createdate: action.createdate,
        error: null,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        auth: false,
        loading: false,
        error: action.error,
      };
    case actionTypes.SAVE_SUCCESS:
      return {
        ...state,
        imageURL: action.imageURL,
        username: action.username,
        bio: action.bio,
        email: action.email,
        message: action.message,
        website: action.website,
        createdate: action.createdate,
        error: null,
      };

    case actionTypes.RESET_POSTED_TWEET:
      return {
        ...state,
        postedTweet: null,
      };

    case actionTypes.TWEET_SUCCESS:
      return {
        ...state,
        postedTweet: true,
        getTweets: false,
      };
    case actionTypes.TWEET_FAIL:
      return {
        ...state,
        postedTweet: false,
      };
    case actionTypes.RESET_ERROR:
      return {
        ...state,
        error: null,
      };
    case actionTypes.SET_LOGOUT:
      return initialState;
    case actionTypes.TWEET_DELETE:
      return {
        ...state,
        getTweets: true,
      };
    // case 'SET_COMMENT':
    //   return {
    //     ...state,
    //     commentSent: action.value,
    //   }
    default:
      return state;
  }
};

export default Reducer;
