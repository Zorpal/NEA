import React, { useEffect, useState } from "react";
import Authorisedroute from "../components/Authorisedroute";
import api from "../api";

const ApplicantProfile = () => {
  const [applicantDetails, setApplicantDetails] = useState([]);

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
      })
      .catch((err) => alert(err));
  };

  const calculateProgress = (details) => {
    let filledFields = 0;
    const totalFields = 11;

    if (details.fullname) filledFields++;
    if (details.email) filledFields++;
    if (details.phonenumber) filledFields++;
    if (details.skill_1) filledFields++;
    if (details.skill_2) filledFields++;
    if (details.skill_3) filledFields++;
    if (details.skill_4) filledFields++;
    if (details.skill_5) filledFields++;
    if (details.qualifications) filledFields++;
    if (details.preferences) filledFields++;
    if (details.cv) filledFields++;

    return (filledFields / totalFields) * 100;
  };

  const recruitmentstage = (progress) => {
    if (progress >= 75) return "Almost there!";
    if (progress >= 50) return "Halfway done!";
    if (progress >= 25) return "Getting started!";
    return "Just beginning!";
  };

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
                  const progress = calculateProgress(details);
                  return (
                    <div key={details.id} className="progress mt-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                      >
                        {recruitmentstage(progress)}
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
