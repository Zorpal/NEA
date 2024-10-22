import React, { useEffect, useState, useContext } from "react";
import Authorisedroute from "../components/Authorisedroute";
import api from "../api";
import { ApplicantProgressContext } from "../context/ApplicantProgressContext";

const ApplicantProfile = () => {
  const [applicantDetails, setApplicantDetails] = useState([]);
  const { ApplicantProgress, setApplicantProgress } = useContext(ApplicantProgressContext);

  useEffect(() => {
    getApplicantDetails();
  }, []);

  const deleteApplicantDetails = (id) => {
    api.delete(`/applicant/details/delete/${id}/`).then((res) => {
      if (res.status === 204) {
        alert("Applicant details deleted successfully");
        getApplicantDetails();
      } else {
        alert("Error deleting applicant details");
      }
    });
  };

  const getApplicantDetails = async () => {
    api
      .get("/applicant/details/")
      .then((res) => res.data)
      .then((data) => {
        setApplicantDetails(data);
        console.log(data);
        if (data.length > 0) {
          setApplicantProgress(1);
        }
      })
      .catch((err) => alert(err));
  };

  const getProgressBarDetails = () => {
    switch (ApplicantProgress) {
      case 1:
        return { width: "25%", label: "Just starting" };
      case 2:
        return { width: "50%", label: "Halfway" };
      case 3:
        return { width: "75%", label: "Almost there" };
      case 4:
        return { width: "100%", label: "Well done!" };
      default:
        return { width: "0%", label: "" };
    }
  };

  const { width, label } = getProgressBarDetails();

  return (
    <Authorisedroute>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            {applicantDetails.length === 0 ? (
              <a
                href="/applicant/details/update/"
                className="btn btn-primary mt-3"
              >
                Add details
              </a>
            ) : (
              applicantDetails.map((details) => (
                <div className="card mb-3" key={details.id}>
                  <div className="card-body">
                    <h5 className="card-title">Your Application</h5>
                    <h6>Name</h6>
                    <p>{details.fullname}</p>
                    <h6>Email</h6>
                    <p>{details.email}</p>
                    <h6>Phone Number</h6>
                    <p>{details.phonenumber}</p>
                    <h6>Skills</h6>
                    <ul>
                      <li>{details.skill_1}</li>
                      <li>{details.skill_2}</li>
                      <li>{details.skill_3}</li>
                      <li>{details.skill_4}</li>
                      <li>{details.skill_5}</li>
                    </ul>
                    <h6>Qualifications</h6>
                    <p>{details.qualifications}</p>
                    <h6>Preferences</h6>
                    <p>{details.preferences}</p>
                    <h6>CV</h6>
                    <p>{details.cv}</p>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={() => deleteApplicantDetails(details.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Application Progress</h5>
                <p className="card-text">Here is your application progress:</p>
                {applicantDetails.map((details) => {
                  return (
                    <div key={details.id} className="progress mt-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width }}
                        aria-valuenow={parseInt(width)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authorisedroute>
  );
};

export default ApplicantProfile;
