import React, { useState } from "react";
import GoogleSSO from "../components/GoogleSSO";
import { useNavigate } from "react-router-dom";

//Function to allow the applicant or employee to login using the same webpage
const Login = () => {
  const [userlogin, setuserlogin] = useState([]);
  const navigate = useNavigate();

  const completelogin = async () => {
    const usernameLength = userlogin.username.length;
    const encryptedPassword = encryptpassword(userlogin.password, usernameLength); //this password is shifted using a caesar shift that shifts based on the length of the username
    
    const response = await fetch("/applicant/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...userlogin, password: encryptedPassword}),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      //fetches the is_staff attribute of the logged in user, if it is set to true in the database, this user is treated as an employee
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
  const encryptpassword = (text, shift) => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      } else if (code >= 48 && code <= 57) {
        return String.fromCharCode(((code - 48 + shift) % 10) + 48);
      }
      return char;
    }).join('');
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
