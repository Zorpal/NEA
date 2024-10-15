import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [register, setregister] = useState([]);
  const navigate = useNavigate();

  const handleinput = (e) => {
    const {name, value} = e.target;
    setregister({
      ...register,
      [name]: value,
    });
  };

  const fetchregister = async () => {
    const response = await fetch("/user/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(register),
    });

    if (response.ok) {
      navigate("/login/");
      window.location.reload();
    }
  };

  const submit = (e) => {
    e.preventDefault();
    fetchregister();
  };

  return (
    <form className="container-sm w-25" onSubmit={submit}>
      <div className="mb-3">
        <label for="username" className="form-label">
          Username
        </label>
        <input
          onChange={handleinput}
          type="username"
          className="form-control"
          name="username"
        />
        <div className="form-text">
          This can be your email address or a specific name you wish to use!
        </div>
      </div>
      <div className="mb-3">
        <label for="password" className="form-label">
          Password
        </label>
        <input
          onChange={handleinput}
          type="password"
          className="form-control"
          name="password"
        />
        <div className="form-text">
          A strong password usually has:
          <ul>
            <li>At least 8 characters</li>
            <li>At least 1 uppercase letter</li>
            <li>At least 1 number</li>
            <li>At least 1 symbol</li>
          </ul>
          We advise for you to use a password manager to automatically create
          you a secure password such as LastPass or iCloud Keychain.
        </div>
      </div>
      <div className="mb-3">
        <label for="confirmpassword" className="form-label">
          Confirm Password
        </label>
        <input
          onChange={handleinput}
          type="password"
          className="form-control"
          name="confirmpassword"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </form>
  );
};

export default Register;
