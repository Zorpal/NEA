import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Toast } from "bootstrap";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState({});
  const [isStaff, setIsStaff] = useState(false);
  const [recommendationsBothSkills, setRecommendationsBothSkills] = useState(
    []
  );
  const [recommendationsOneSkill, setRecommendationsOneSkill] = useState([]);
  const [applicantDetails, setApplicantDetails] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

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

  const getJob = useCallback(async () => {
    try {
      const response = await api.get(`/Jobs/List/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }, [jobId]);

  const getRecommendations = useCallback(async () => {
    try {
      const response = await api.get(`/Jobs/jobs/${jobId}/recommendations/`);
      setRecommendationsBothSkills(response.data.recommendations_both_skills);
      setRecommendationsOneSkill(response.data.recommendations_one_skill);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }, [jobId]);

  const getApplicantDetails = useCallback(async (email) => {
    try {
      const response = await api.get(`/applicant/details/${email}/`);
      setApplicantDetails((prevDetails) => ({
        ...prevDetails,
        [email]: response.data[0],
      }));
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    if (jobId) {
      getJob();
      getRecommendations();
    }
  }, [jobId, getJob, getRecommendations]);

  const updateRecruitmentTracker = async (email) => {
    try {
      await api.post("/applicant/updatert/", {
        email,
        recruitmenttracker: 3,
        job_id: jobId,
      });
      setToastMessage("Recruitment tracker updated successfully");
      showToast();
    } catch (error) {
      setToastMessage("Error updating recruitment tracker");
      showToast();
    }
  };

  const showToast = () => {
    const toastLiveExample = document.getElementById("liveToast");
    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  };

  const handleApplicantClick = (email) => {
    setSelectedApplicant(email);
    if (!applicantDetails[email]) {
      getApplicantDetails(email);
    }
    const toastLiveExample = document.getElementById(`liveToast-${email}`);
    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              {job.jobtitle} - Job at {job.companyname}
            </div>
            <div className="card-body">
              <p className="card-text">Job Type: {job.jobtype}</p>
              <p className="card-text">Salary: £{job.salary}</p>
              <p className="card-text">Job Description: {job.jobdescription}</p>
              <p className="card-text">Location: {job.location}</p>
              <p className="card-text">
                Date listing was posted: {job.dateposted}
              </p>
              <p className="card-text">Deadline to apply: {job.deadline}</p>
              <p className="card-text">
                Sought skills: {job.jobprimaryskill}, {job.jobsecondaryskill}
              </p>
            </div>
          </div>
        </div>
        {isStaff && (
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">Applicants with Both Skills</div>
                  <div className="card-body">
                    <ul className="list-group">
                      {recommendationsBothSkills.map((email) => (
                        <li
                          key={email}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {email}
                          <button
                            className="btn btn-primary"
                            onClick={() => handleApplicantClick(email)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => updateRecruitmentTracker(email)}
                          >
                            Recommend this to applicant?
                          </button>
                          <div
                            className="toast-container position-fixed bottom-0 end-0 p-3"
                            id={`toast-container-${email}`}
                          >
                            <div
                              id={`liveToast-${email}`}
                              className="toast"
                              role="alert"
                              aria-live="assertive"
                              aria-atomic="true"
                            >
                              <div className="toast-header">
                                <strong className="me-auto">
                                  Applicant Details
                                </strong>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="toast"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="toast-body">
                                {applicantDetails[email] && (
                                  <div>
                                    <h5>
                                      Name: {applicantDetails[email].fullname}
                                    </h5>
                                    <p>Email: {applicantDetails[email].email}</p>
                                    <p>
                                      Phone Number:{" "}
                                      {applicantDetails[email].phonenumber}
                                    </p>
                                    <p>Skills: {applicantDetails[email].skills}</p>
                                    <p>
                                      Qualifications:{" "}
                                      {applicantDetails[email].qualifications}
                                    </p>
                                    <p>
                                      Preferences:{" "}
                                      {applicantDetails[email].preferences}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-3">
                <div className="card">
                  <div className="card-header">Applicants with One Skill</div>
                  <div className="card-body">
                    <ul className="list-group">
                      {recommendationsOneSkill.map((email) => (
                        <li
                          key={email}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {email}
                          <button
                            className="btn btn-primary"
                            onClick={() => handleApplicantClick(email)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => updateRecruitmentTracker(email)}
                          >
                            Recommend this to applicant?
                          </button>
                          <div
                            className="toast-container position-fixed bottom-0 end-0 p-3"
                            id={`toast-container-${email}`}
                          >
                            <div
                              id={`liveToast-${email}`}
                              className="toast"
                              role="alert"
                              aria-live="assertive"
                              aria-atomic="true"
                            >
                              <div className="toast-header">
                                <strong className="me-auto">
                                  Applicant Details
                                </strong>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="toast"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="toast-body">
                                {applicantDetails[email] && (
                                  <div>
                                    <h5>
                                      Name: {applicantDetails[email].fullname}
                                    </h5>
                                    <p>Email: {applicantDetails[email].email}</p>
                                    <p>
                                      Phone Number:{" "}
                                      {applicantDetails[email].phonenumber}
                                    </p>
                                    <p>Skills: {applicantDetails[email].skills}</p>
                                    <p>
                                      Qualifications:{" "}
                                      {applicantDetails[email].qualifications}
                                    </p>
                                    <p>
                                      Preferences:{" "}
                                      {applicantDetails[email].preferences}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        id="toast-container"
      >
        <div
          id="liveToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Notification</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;