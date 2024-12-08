import React, { useEffect, useState } from "react";
import Authorisedroute from "../components/Authorisedroute";
import api from "../api";

//function to display the profile of an applicant
const ApplicantProfile = () => {
  const [applicantDetails, setApplicantDetails] = useState([]);

  useEffect(() => {
    getApplicantDetails();
  }, []);

  //function to delete the details stored in the database, removes them from TRL_applicantdetails and TRL_applicantskills
  const deleteApplicantDetails = (id) => {
    api
      .delete(`/applicant/details/delete/${id}/`).then((res) => {
      if (res.status === 204) {
        alert("Applicant details deleted successfully");
        getApplicantDetails();
      } else {
        alert("Error deleting applicant details");
      }
    });
  };

  //function to get the details of the applicant from the database
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

  //function to accept the job, updates the recruitment tracker to 4
  const acceptJob = (jobTitle, email) => {
    console.log(email, jobTitle);
    api
      .post("/applicant/updatert/", { email, recruitmenttracker: 4, job_title: jobTitle })
      .then((res) => {
        if (res.status === 200) {
          alert("Job accepted successfully");
          getApplicantDetails();
        } else {
          alert("Error accepting job");
        }
      });
  };

  //function to calculate the size of the progress bar based on the recruitment tracker value (imitates what stage of the recruitment process the applicant is it)
  const calculateProgress = (trackerValue) => {
    switch (trackerValue) {
      case 1:
        return { width: "25%", label: "Stage 1/4" };
      case 2:
        return { width: "50%", label: "Stage 2/4" };
      case 3:
        return { width: "75%", label: "Stage 3/4" };
      case 4:
        return { width: "100%", label: "Stage 4/4" };
      case 5:
        return { width: "100%", label: "Stage 4/4" };
      default:
        return { width: "0%", label: "" };
    }
  };

  //function to get the text to display based on the recruitment tracker value
  const getTrackerText = (trackerValue) => {
    switch (trackerValue) {
      case 1:
        return "We have successfully received your application and are in the process of reviewing it.";
      case 2:
        return "Your application has been reviewed by one of our members and we are in the process of searching for a job that best matches your skills.";
      case 3:
        return "We have found you a job that matches your skills, check your email and please confirm that you are interested in this job!";
      case 4:
        return "We have successfully matched you with a job, congratulations! Please look out for an email/call from us with further details.";
      case 5:
        return "We have successfully matched you with a job, congratulations! Please look out for an email/call from us with further details.";
      default:
        return "";
    }
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
                      {details.skills ? details.skills.split(',').map((skill, index) => (
                        <li key={index}>{skill}</li>
                      )) : <li>No skills listed</li>}
                    </ul>
                    <h6>Qualifications</h6>
                    <p>{details.qualifications}</p>
                    <h6>Preferences</h6>
                    <p>{details.preferences}</p>

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
                  const { width, label } = calculateProgress(
                    details.recruitmenttracker
                  );
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
            {applicantDetails.map((details) => {
              const trackerText = getTrackerText(details.recruitmenttracker);
              return (
                <div key={details.id} className="card mt-3">
                  <div className="card-body">
                    <h5 className="card-title">Progress Center</h5>
                    <p className="card-text">{trackerText}</p>
                    {details.recruitmenttracker === 3 && (
                      <div className="card mt-3">
                        <div className="card-body">
                          <h5 className="card-title">Recommended Job</h5>
                          <p className="card-text">{details.recommended_job_title}</p>
                          <button
                            className="btn btn-success"
                            onClick={() => acceptJob(details.recommended_job_title, details.email)}
                          >
                            Inquire more about this job
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Authorisedroute>
  );
};

export default ApplicantProfile;