import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import "./updateProfile.css";
import { connect } from "react-redux";
import * as actions from "../action/action";
import { useNavigate } from "react-router-dom";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function UpdateProfilePage(props) {
  const [fileList, setFileList] = useState([
    {
      name: "image.png",
      status: "done",
      url: props.imageURL,
    },
  ]);

  const [data, setData] = useState({
    profileImage:
      fileList.length === 1 && fileList[0].url !== undefined
        ? fileList[0].url
        : null,
    username: props.username,
    bio: props.bio,
    email: props.email,
    website: props.website,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const navigate = useNavigate();

  const handleImgChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCustomRequest = async (options) => {
    const now = new Date();
    const dateTimeString = now.getTime();
    const fileKey =
      "user/" +
      props.username +
      "/" +
      props.userId +
      "/" +
      dateTimeString +
      "_" +
      options.file.name;
    try {
      // upload the file to Amazon S3
      const result = await actions.uploadImgToAWSS3(
        "twitter-user-image",
        fileKey,
        options.file
      );
      // indicate that the upload was successful
      options.onSuccess(result);
      setData({
        ...data,
        profileImage: result.Location,
      });
    } catch (error) {
      options.onerror(error);
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChange = (event) => {
    let name = event.target.name;
    switch (name) {
      case "username":
        setData({
          ...data,
          username: event.target.value,
        });
        break;
      case "bio":
        setData({
          ...data,
          bio: event.target.value,
        });
        break;
      case "email":
        setData({
          ...data,
          email: event.target.value,
        });
        break;
      case "website":
        setData({
          ...data,
          website: event.target.value,
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const button = document.querySelector("#saveDetails");
    button.disabled = true;
    const stateKeys = Object.keys(data);
    const formData = new FormData();
    stateKeys.map((key) => {
      formData.append(key, data[key]);
    });
    // when the result is success, navigate to home or setting page!!!
    props.onSubmit(formData, navigate);
  };

  return (
    <div className="editProfile">
      <p id="saveDetailsResult"></p>
      <form className="profileDetails" onSubmit={handleSubmit}>
        <div className="profileEditPrompt noborder">
          <div>
            <p>Edit Profile</p>
          </div>
        </div>
        <>
          <Upload
            customRequest={handleCustomRequest}
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleImgChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </>
        <div className="editProfileDiv">
          <label>Name</label>
          <input
            placeholder={props.username}
            name="username"
            onChange={handleChange}
            maxLength="20"
          />
        </div>
        <div className="editProfileDiv">
          <label>Bio</label>
          <input
            placeholder={props.bio}
            name="bio"
            onChange={handleChange}
            maxLength="160"
          />
        </div>
        <div className="editProfileDiv">
          <label>Email</label>
          <input
            placeholder={props.email}
            name="email"
            onChange={handleChange}
          />
        </div>
        <div className="editProfileDiv">
          <label>Website</label>
          <input
            placeholder={props.website}
            name="website"
            onChange={handleChange}
          />
        </div>
        <button id="saveDetails">Save</button>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    imageURL: state.imageURL,
    bio: state.bio,
    username: state.username,
    email: state.email,
    error: state.error,
    message: state.message,
    website: state.website,
    userId: state.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (profileData, navigate) =>
      dispatch(actions.saveDetails(profileData, navigate)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfilePage);
