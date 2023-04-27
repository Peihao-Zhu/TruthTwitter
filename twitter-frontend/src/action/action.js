import axios from "axios";
import * as actionTypes from "../store/actionTypes";
import S3 from "aws-sdk/clients/s3";
import { baseUrl, ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../config/config";
import { Link } from "react-router-dom";

export const signin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      username: username,
      password: password,
    };
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
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
        dispatch(authFail(error.message));
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    let url = baseUrl + "/api/user/logout";
    axios
      .get(url)
      .then(() => {
        dispatch(setLogout());
      })
      .catch((error) => {});
  };
};

export const setLogout = () => {
  return {
    type: "SET_LOGOUT",
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
        dispatch(authFail(error.message));
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

export const saveDetails = (details, navigate) => {
  const button = document.querySelector("#saveDetails");
  const saveDetailsResult = document.querySelector("#saveDetailsResult");
  return (dispatch, getState) => {
    let url = baseUrl + `/api/user/${getState().userId}/profile`;
    const profile = {};
    for (let [key, value] of details) {
      profile[key] = value;
    }
    const config = {
      withCredentials: true,
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
        button.disabled = false;
        saveDetailsResult.textContent = "Save Error";
        saveDetailsResult.style.color = "red";
        setTimeout(() => {
          saveDetailsResult.style.display = "none";
        }, 3000);
        if (error.response.status === 401) {
          dispatch(setLogout());
          navigate("/signin");
        } else {
          dispatch(authFail(error.message));
        }
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

export const searchResult = (query, navigate) => {
  const url = baseUrl + `/api/user/search?keyword=${query}`;
  return (dispatch) =>
    axios({
      method: "get",
      url: url,
    })
      .then((res) => {
        return res.data.map((user, _) => {
          return {
            value: user.username,
            label: (
              <Link to={`/user/${user._id}`}>
                <div className="userSummary">
                  <img
                    src={user.profileImage}
                    alt="user avatar"
                    className="userImage"
                  />
                  <div className="username">{user.username}</div>
                </div>
              </Link>
            ),
          };
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(setLogout());
          navigate("/signin");
        } else {
          dispatch(authFail(error.message));
        }
      });
};

export const deletePost = (postId, userId, setDeleteTweet, navigate) => {
  return (dispatch) => {
    const url = baseUrl + `/api/tweet/${postId}`;
    const data = { userId: userId };
    axios({
      method: "delete",
      url: url,
      data: data,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setDeleteTweet(true);
      })
      .catch((error) => {
        setDeleteTweet(false);
        if (error.response.status === 401) {
          dispatch(setLogout());
          navigate("/signin");
        } else {
          dispatch(authFail(error.message));
        }
      });
  };
};

export const editPost = (
  postId,
  userId,
  tweetContent,
  setEditTweet,
  navigate
) => {
  return (dispatch) => {
    const url = baseUrl + `/api/tweet/${postId}`;
    const tweetData = {
      content: tweetContent,
      userId: userId,
    };
    axios({
      method: "put",
      url: url,
      data: tweetData,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setEditTweet(true);
      })
      .catch((error) => {
        setEditTweet(false);

        if (error.response.status === 401) {
          navigate("/signin");
          dispatch(setLogout());
        } else {
          dispatch(authFail(error.message));
        }
        // setError(true)
        // setLoading(false)
      });
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
