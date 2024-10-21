import React, { useEffect, useState, useContext } from "react";
import ApplicantContext from "../context/ApplicantContext";
import { Link } from "react-router-dom";
import trllogo from "../images/trllogo.png";

const Header = () => {
  const [isStaff, setIsStaff] = useState(false);
  const { userinformation } = useContext(ApplicantContext);

  useEffect(() => {
    const retrievestaffstatus = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await fetch("/applicant/retrieve-staff-status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsStaff(data.is_staff);
        }
      }
    }
    retrievestaffstatus();
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${isStaff ? 'bg-dark' : 'bg-body-tertiary'}`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={trllogo}
            alt="Templewood Recruitment Limited Logo"
            className="navbar-brand-logo"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className={`nav-link ${isStaff ? 'text-white' : ''}`} aria-current="page" href={isStaff ? "/employee/home/" : "/"}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${isStaff ? 'text-white' : ''}`} href={isStaff ? "/Jobs/add/" : "/Jobs/List/"}>
                Jobs
              </a>
            </li>
            {userinformation.access_token ? (
              <>
                <a className={`nav-link ${isStaff ? 'text-white' : ''}`} href={isStaff ? "/applicant/list/" : "/applicant/details/"}>
                  {isStaff ? "Applicants" : "Profile"}
                </a>
              </>
            ) : (
              <>
                <a className={`nav-link ${isStaff ? 'text-white' : ''}`}>| Login to view your profile |</a>
              </>
            )}
          </ul>
          <span className={`navbar-text ${isStaff ? 'text-white' : ''}`}>
            {userinformation.access_token ? (
              <>
                Hello {userinformation.username}
                <Link className={`nav-link ${isStaff ? 'text-white' : ''}`} to="/logout/">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <div>
                  <span className={`navbar-text ${isStaff ? 'text-white' : ''}`}>
                    <div className="d-flex">
                      <Link className={`nav-link ${isStaff ? 'text-white' : ''}`} to="/login/">
                        Login{" "}
                      </Link>
                      |
                      <Link className={`nav-link ${isStaff ? 'text-white' : ''}`} to="/register/">
                        Register{" "}
                      </Link>
                    </div>
                  </span>
                </div>
              </>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
