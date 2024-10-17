import React, {useContext} from "react";
import ApplicantContext from "../context/ApplicantContext";
import { Link } from "react-router-dom";
import trllogo from "../images/trllogo.png";
const Header = () => {
    const { userinformation } = useContext(ApplicantContext);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">

        <a className="navbar-brand" href="/">
          <img src={trllogo} alt="Templewood Recruitment Limited Logo" className="navbar-brand-logo" />
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
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Jobs/List/">
                Jobs
              </a>
            </li>
            {userinformation.access_token ? (
                <>
                    <a className="nav-link" href="/applicant/details/">
                        Details
                    </a>
                </>
            ) : (
                <>
                    <a className="nav-link">
                      | Login to view your profile |
                    </a>
                </>
            )}

          </ul>
          <span className="navbar-text">
            {userinformation.access_token ? (
                <>
                    Hello {userinformation.username}
                    <Link className="nav-link" to="/logout/">
                        Logout
                    </Link>
                </>
            ) : (
                <><div>
                  <span className="navbar-text">
                    <div className="d-flex">
                      <Link className="nav-link" to='/login/'>Login </Link>
                       | 
                      <Link className="nav-link" to='/register/'>Register </Link>
                    </div>
                  </span>
                </div></>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
