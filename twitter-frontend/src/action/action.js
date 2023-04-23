import axios from "axios";
import * as actionTypes from "../store/actionTypes";
import S3 from "aws-sdk/clients/s3";
import { baseUrl, ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../config/config";

export const signin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      username: username,
      password: password,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // console.log('sign in ' + username + ' ' + password)
    const url = baseUrl + "/api/user/signin";
    axios
      .post(url, authData, config)
      .then((response) => {
        if (response.status === 404 || response.status === 500) {
          throw response;
        } else {
          dispatch(authSuccess(response.data));
        }
      })
      .catch((error) => {
        dispatch(authFail(error.response.data));
      });
  };
};

export const signup = (data) => {
  return (dispatch) => {
    dispatch(authStart());
    const signupData = {
      username: data.nickname,
      password: data.password,
      email: data.email,
      website: data.website,
      bio: data.bio,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let url = baseUrl + "/api/user/signup";
    axios
      .post(url, signupData, config)
      .then((response) => {
        if (response.status === 400 || response.status === 500) {
          throw response;
        } else {
          dispatch(authSuccess(response.data));
        }
      })
      .catch((error) => {
        console.log(
          "signup error " + error + " " + error.status + " " + error.message
        );
        dispatch(authFail(error));
      });
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (res) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: res.token,
    userId: res._id,
    imageURL: res.profileImage,
    username: res.username,
    bio: res.bio,
    email: res.email,
    website: res.website,
    createdate: res.createDate,
  };
};

export const saveDetails = (details) => {
  const button = document.querySelector("#saveDetails");
  const saveDetailsResult = document.querySelector("#saveDetailsResult");
  return (dispatch, getState) => {
    let url = baseUrl + `/api/user/${getState().userId}/profile`;
    const profile = {};
    for (let [key, value] of details) {
      profile[key] = value;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .put(url, profile, config)
      .then((response) => {
        dispatch(saveSuccess(response.data));
        button.disabled = false;
        saveDetailsResult.textContent = "Save Successfully";
        saveDetailsResult.style.color = "green";
        setTimeout(() => {
          saveDetailsResult.style.display = "none";
        }, 3000);
      })
      .catch((error) => {
        dispatch(authFail(error.message));
        button.disabled = false;
        saveDetailsResult.textContent = "Save Error";
        saveDetailsResult.style.color = "red";
        setTimeout(() => {
          saveDetailsResult.style.display = "none";
        }, 3000);
      });
  };
};

export const saveSuccess = (res) => {
  return {
    type: actionTypes.SAVE_SUCCESS,
    imageURL: res.profileImage,
    username: res.username,
    bio: res.bio,
    email: res.email,
    message: res.message,
    website: res.website,
    createdate: res.createDate,
  };
};

export const postTweet = (tweet) => {
  return (dispatch, getState) => {
    let url = "https://tweeter-8qqa.onrender.com/posts/create";
    axios({
      method: "post",
      url: url,
      data: tweet,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(dispatch({ type: actionTypes.TWEET_SUCCESS }))
      .catch(dispatch({ type: actionTypes.TWEET_FAIL }));
  };
};

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

export const uploadImgToAWSS3 = (bucketName, fileKey, fileBody) => {
  return s3
    .upload({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBody,
    })
    .promise();
};
