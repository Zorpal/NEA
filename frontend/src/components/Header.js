import React, { useEffect, useState, useContext } from "react";
import ApplicantContext from "../context/ApplicantContext";
import { Link } from "react-router-dom";
import trllogo from "../images/trllogo.png";
import api from "../api";

//Function to render a header on each page that differs depending on whether the logged in user is an employee or an applicant
const Header = () => {
  const { userinformation } = useContext(ApplicantContext);
  const [isStaff, setIsStaff] = useState(false);

  //gets the is_staff attribute of each user from the backend server
  useEffect(() => {
    const retrievestaffstatus = async () => {
      try {
      const response = await api.get("/applicant/retrieve-staff-status");
      if (response.status === 200) {
        setIsStaff(response.data.is_staff);
      }
      } catch (error) {
      console.error("Error retrieving staff status:", error);
      }
    };
    retrievestaffstatus();
  }, []);
//renders Home, Jobs and Profile if the user is logged in; renders Home, Jobs, Add a Job and Applicants if an employee is logged in, else renders Home and Jobs
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
              <a className={`nav-link ${isStaff ? 'text-white' : ''}`} href="/Jobs/list/">
                Jobs
              </a>
            </li>
            {isStaff && (
              <li className="nav-item">
                <a className={`nav-link ${isStaff ? 'text-white' : ''}`} href="/Jobs/add/">
                  Add a job
                </a>
              </li>
            )}
            {userinformation.access_token ? (
              <>
                <a className={`nav-link ${isStaff ? 'text-white' : ''}`} href={isStaff ? "/applicant/list/" : "/applicant/details/"}>
                  {isStaff ? "Applicants" : "Profile"}
                </a>
              </>
            ) : (
              <>
                <button className={`nav-link ${isStaff ? 'text-white' : ''}`}>| Login to view your profile |</button>
              </>
            )}
          </ul>
          <span className={`navbar-text ${isStaff ? 'text-white' : ''}`}>
            {userinformation.access_token ? (
              <>
                Hello
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

export default Header
