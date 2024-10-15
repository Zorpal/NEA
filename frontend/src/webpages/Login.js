import React, { useState, useEffect } from "react";
import GoogleSSO from "../components/GoogleSSO";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [userlogin, setuserlogin ] = useState([])
    const navigate = useNavigate()
    const completelogin = async() => {
      const response = await fetch('/user/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userlogin)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.removeItem('access_token')
        localStorage.setItem('access_token', data.access)
        navigate('/')
        window.location.reload()

      }
    }

    const input = (e) => {
      const {name, value} = e.target
      setuserlogin({
        ...userlogin,
        [name]: value
      })
    }

    const submit = (e) => {
      e.preventDefault()
      completelogin()
    }

  return (
      <form className="container-sm w-25" onSubmit={submit}> 
        <div className="mb-3">
          <label for="username" className="form-label">
            Username
          </label>
          <input
            onChange={input}
            type="username"
            class="form-control"
            name="username"
          />
          <div id="emailHelp" className="form-text">
          </div>
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">
            Password
          </label>
          <input
            onChange={input}
            type="password"
            class="form-control"
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
