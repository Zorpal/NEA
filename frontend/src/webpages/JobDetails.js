// JobDetails.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState({});
  const [isStaff, setIsStaff] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

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

    //function to update the recruitment tracker of the applicant, parsing in the email, jobId and the recruitment tracker status
    const updateRecruitmentTracker = async (email) => {
      api
        .post("/applicant/updatert/", { email, recruitmenttracker: 3, job_id: jobId })
        .then((res) => {
          alert("Recruitment tracker updated successfully");
        })
        .catch((err) => alert(err));
    };

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
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      getJob();
      getRecommendations();
    }
  }, [jobId, getJob, getRecommendations]);

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
              <div className="card-header">
                Recommended Applicants:
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {recommendations.map((email) => (
                    <li
                      key={email}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {email}
                      <button
                        className="btn btn-primary"
                        onClick={() => updateRecruitmentTracker(email)}
                      >
                        Recommend this to applicant?
                      </button>
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

