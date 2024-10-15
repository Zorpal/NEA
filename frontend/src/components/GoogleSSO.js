import React from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleSSO = () => {
  const navigate = useNavigate();
  const handleSuccess = (codeResponse) => {
    const authorisation = codeResponse.code;
    fetch("/user/g-sso/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({code: authorisation }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("access_token", data["access_token"]);
        localStorage.setItem("username", data["username"]);
        navigate("/");
        Window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    flow: "auth-code",
  });
  return (
    <div>
      <GoogleButton onClick={login} label="Sign in using Google" />
    </div>
  );
};

export default GoogleSSO;
