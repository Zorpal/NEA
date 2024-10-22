import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState({});
  const [isStaff, setIsStaff] = useState(false);
  const [applicantDetails, setApplicantDetails] = useState([]);
  const [applicantEmails, setApplicantEmails] = useState([]);
  const [secondaryApplicantEmails, setSecondaryApplicantEmails] = useState([]);

  useEffect(() => {
    getApplicantDetails();
  }, []);

  const getApplicantDetails = async () => {
    api
      .get("/applicant/applicant/list/")
      .then((res) => res.data)
      .then((data) => {
        setApplicantDetails(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

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
    };
    retrievestaffstatus();
  }, []);

  useEffect(() => {
    if (jobId) {
      getJob();
    }
  }, [jobId]);

  useEffect(() => {
    if (job.jobprimaryskill) {
      primaryskilltofilterapplicants(job.jobprimaryskill);
    }
  }, [job.jobprimaryskill]);

  useEffect(() => {
    if (job.jobsecondaryskill) {
      secondaryskilltofilterapplicants(job.jobsecondaryskill);
    }
  }, [job.jobsecondaryskill]);

  const getJob = () => {
    fetch(`/Jobs/List/${jobId}`)
      .then((response) => response.json())
      .then((data) => {
        setJob(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateRecruitmentTracker = async (email) => {
    api
      .post("/applicant/updatert/", { email, recruitmenttracker: 3 })
      .then((res) => {
        alert("Recruitment tracker updated successfully");
      })
      .catch((err) => alert(err));
  };

  const primaryskilltofilterapplicants = (primarySkill) => {
    fetch("/applicant/skills/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill: primarySkill }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }
        return response.json();
      })
      .then((data) => {
        setApplicantEmails(data.emails);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to fetch applicant emails. Please try again.");
      });
  };

  const secondaryskilltofilterapplicants = (secondarySkill) => {
    fetch("/applicant/skills/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill: secondarySkill }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw err;
        }
        return response.json();
      })
      .then((data) => {
        setSecondaryApplicantEmails(data.emails);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to fetch applicant emails. Please try again.");
      });
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
              <div className="card-header">
                Applicants with {job.jobprimaryskill} skill:
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {applicantEmails.map((email) => (
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
            <div className="card mt-3">
              <div className="card-header">
                Applicants with {job.jobsecondaryskill} skill:
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {secondaryApplicantEmails.map((email) => (
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
