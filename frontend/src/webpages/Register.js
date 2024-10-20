import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [register, setRegister] = useState({ username: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [ignoreWarnings, setIgnoreWarnings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isPasswordValid = validatePassword(register.password);
    setIsSubmitDisabled(
      (register.password !== confirmPassword || !isPasswordValid) && !ignoreWarnings
    );
  }, [register.password, confirmPassword, ignoreWarnings]);

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    if (!hasNumber || !hasSymbol || !isValidLength) {
      setPasswordError("Password must be at least 8 characters long and contain at least 1 number and 1 symbol.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "confirmpassword") {
      setConfirmPassword(value);
    } else {
      setRegister({
        ...register,
        [name]: value,
      });
    }
  };

  const bypasssecurepassword = (e) => {
    setIgnoreWarnings(e.target.checked);
  };

  const fetchRegister = async () => {
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
    const form = e.target;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      fetchRegister();
    }
    form.classList.add("was-validated");
  };

  return (
    <form className="container-sm w-25 needs-validation" onSubmit={submit} noValidate>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          onChange={handleInput}
          type="text"
          className="form-control"
          name="username"
          required
        />
        <div className="invalid-feedback">
          Please provide a valid username.
        </div>
        <div className="form-text">
          This can be your email address or a specific name you wish to use!
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          onChange={handleInput}
          type="password"
          className="form-control"
          name="password"
          required
        />
        <div className="invalid-feedback">
          {passwordError || "Please provide a valid password."}
        </div>
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
        <label htmlFor="confirmpassword" className="form-label">
          Confirm Password
        </label>
        <input
          onChange={handleInput}
          type="password"
          className="form-control"
          name="confirmpassword"
          required
        />
        <div className="invalid-feedback">
          Please confirm your password.
        </div>
      </div>
      {passwordError && (
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="ignoreWarnings"
            onChange={bypasssecurepassword}
          />
          <label className="form-check-label" htmlFor="ignoreWarnings">
            I have read the warnings and choose to ignore them.
          </label>
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={isSubmitDisabled}>
        Register
      </button>
    </form>
  );
};

export default Register;
