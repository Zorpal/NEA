import React, { useState } from "react";
import GoogleSSO from "../components/GoogleSSO";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userlogin, setuserlogin] = useState([]);
  const navigate = useNavigate();

  const completelogin = async () => {
    const response = await fetch("/applicant/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userlogin),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      const staffResponse = await fetch("/applicant/retrieve-staff-status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access}`,
          "Content-Type": "application/json",
        },
      });

      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        if (staffData.is_staff === true) {
          navigate("/employee/home/");
        } else {
          navigate("/");
        }
        window.location.reload();
      }
    }
  };

  const input = (e) => {
    const { name, value } = e.target;
    setuserlogin({
      ...userlogin,
      [name]: value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    completelogin();
  };

  return (
    <form className="container-sm w-25" onSubmit={submit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          onChange={input}
          type="username"
          className="form-control"
          name="username"
        />
        <div id="emailHelp" className="form-text"></div>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          onChange={input}
          type="password"
          className="form-control"
          name="password"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
      <GoogleSSO />
    </form>
  );
};

export default Login;
