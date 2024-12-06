import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

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
    api
      .post("/applicant/updatert/", {
        email,
        recruitmenttracker: 3,
        job_id: jobId,
      })
      .then((res) => {
        alert("Recruitment tracker updated successfully");
      })
      .catch((err) => alert(err));
  };

  const handleApplicantClick = (email) => {
    setSelectedApplicant(email);
    if (!applicantDetails[email]) {
      getApplicantDetails(email);
    }
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
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${email}`}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateRecruitmentTracker(email)}
                      >
                        Recommend this to applicant?
                      </button>
                      <div className="collapse" id={`collapse-${email}`}>
                        {applicantDetails[email] && (
                          <div className="card card-body">
                            <h5>Name: {applicantDetails[email].fullname}</h5>
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
                              Preferences: {applicantDetails[email].preferences}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              class="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div class="toast-header">
                <strong class="me-auto">Bootstrap</strong>
                <small>11 mins ago</small>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                ></button>
              </div>
              <div class="toast-body">
                Hello, world! This is a toast message.
              </div>
            </div>
            <div className="card mt-3">
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
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${email}`}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => updateRecruitmentTracker(email)}
                      >
                        Recommend this to applicant?
                      </button>
                      <div className="collapse" id={`collapse-${email}`}>
                        {applicantDetails[email] && (
                          <div className="card card-body">
                            <h5>Name: {applicantDetails[email].fullname}</h5>
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
                              Preferences: {applicantDetails[email].preferences}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;