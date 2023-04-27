import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../config/config";
import { Spin } from "antd";

function withAuth(RedirectComponent) {
  return function (props) {
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      const url = baseUrl + "/api/user/auth";
      Axios.get(url)
        .then((res) => {
          console.log("result from auth ", res);
          if (res.status === 200) {
            setLoading(false);
          } else {
            throw new Error(res.error);
          }
        })
        .catch((err) => {
          console.error("error ", err);
          setRedirect(true);
          setLoading(false);
        });
    }, []);
    if (loading) {
      return (
        <div className="itemCenter">
          <Spin size="large" />
        </div>
      );
    }
    if (redirect) {
      return <Navigate to="/signin" />;
    }
    return <RedirectComponent />;
  };
}
export default withAuth;
