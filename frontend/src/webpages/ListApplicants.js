import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Authorisedroute from "../components/Authorisedroute";
import { Toast } from "bootstrap";

// Function to list all applicants who have sent their details in
const ListApplicants = () => {
  const [ApplicantDetails, setApplicantDetails] = useState([]);
  const [ApplicantsToContact, setApplicantsToContact] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [Recommendations, setRecommendations] = useState([]);
  const [JobRecommendations, setJobRecommendations] = useState([]);
  const [isStaff, setIsStaff] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [noApplicantsMessage, setNoApplicantsMessage] = useState("");
  const navigate = useNavigate();

  // Checks if the current user is an employee
  useEffect(() => {
    const retrievestaffstatus = async () => {
      try {
        const response = await api.get("/applicant/retrieve-staff-status");
        if (response.status === 200) {
          setIsStaff(response.data.is_staff);
          if (!response.data.is_staff) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error retrieving staff status:", error);
        navigate("/");
      }
    };
    retrievestaffstatus();
  }, [navigate]);

  // Retrieves every job from the database
  const getJobs = useCallback(async () => {
    try {
      const response = await api.get("/Jobs/List/");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, []);

  // Retrieves every applicant from the database
  const getApplicantDetails = useCallback(async () => {
    try {
      const response = await api.get("/applicant/applicant/list/");
      setApplicantDetails(response.data);
    } catch (error) {
      alert('You are not authorised to view this. You are not logged in.', error);
    }
  }, []);

  // Retrieves applicants who need to be contacted
  const getApplicantsToContact = useCallback(async () => {
    try {
      const response = await api.get("/applicant/applicants-to-contact/");
      setApplicantsToContact(response.data);
      console.log(response.data);
    } catch (error) {
      alert('You are not authorised to view this. You are not logged in.', error);
    }
  }, []);

  // Fetch job recommendations
  const getJobRecommendations = useCallback(async () => {
    try {
      const response = await api.get("/Jobs/job-recommendations/");
      const jobRecommendations = await Promise.all(
        response.data.map(async (rec) => {
          const jobResponse = await api.get(`/Jobs/List/${rec.job_id}`);
          return {
            ...rec,
            jobTitle: jobResponse.data.jobtitle,
          };
        })
      );
      setJobRecommendations(jobRecommendations);
    } catch (error) {
      alert(error);
    }
  }, []);

  // Fetch recommended job ID for each applicant
  const fetchRecommendations = async () => {
    setLoading(true);
    setNoApplicantsMessage("");
    try {
      const applicantsWithRecommendations = await Promise.all(
        ApplicantDetails.filter(applicant => applicant.recruitmenttracker === 2)
          .map(async (applicant) => {
            const skills = applicant.skills.split(",");
            const recommendationResponse = await api.post(`/Jobs/jobs/recommendations/`, {
              applicant_skills: skills,
            });
            const recommendedJobId = recommendationResponse.data.predicted_job_id;
            const jobResponse = await api.get(`/Jobs/List/${recommendedJobId}`);
            const jobTitle = jobResponse.data.jobtitle;
            return {
              name: applicant.fullname,
              email: applicant.email,
              recommendedJobId,
              jobTitle,
            };
          })
      );

      if (applicantsWithRecommendations.length === 0) {
        setNoApplicantsMessage("No more applicants are available for job shortlisting");
      } else {
        setRecommendations(applicantsWithRecommendations.filter(rec => rec !== null));
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
    getApplicantDetails();
    getApplicantsToContact();
    getJobRecommendations();
  }, [getJobs, getApplicantDetails, getApplicantsToContact, getJobRecommendations]);

  // Function to update the recruitment tracker of an applicant, it updates to 3 so their progress bar fills to 3
  const markasreviewed = async (email) => {
    try {
      await api.post("/applicant/updatert/", { email, recruitmenttracker: 2});
      alert("Recruitment tracker updated successfully");
      getApplicantDetails();
    } catch (error) {
      alert(error);
    }
  };

  const updateRecruitmentTracker = async (email, jobId) => {
    try {
      await api.post("/applicant/updatert/", {
        email,
        recruitmenttracker: 3,
        job_id: jobId,
      });
      alert("Recruitment tracker updated successfully");
      getApplicantDetails();
    } catch (error) {
      alert(error);
    }
  };

  // Function to update the recruitment tracker to stage 5 once contacted
  const markAsContacted = async (email) => {
    try {
      await api.post("/applicant/updatert/", { email, recruitmenttracker: 5 });
      alert("Applicant marked as contacted");
      getApplicantsToContact();
    } catch (error) {
      alert(error);
    }
  };

  // Function to fetch job details and show toast
  const showJobDetails = async (jobId) => {
    try {
      const response = await api.get(`/Jobs/List/${jobId}`);
      setJobDetails(response.data);
      setToastMessage(`Job Title: ${response.data.jobtitle}`);
      showToast();
    } catch (error) {
      alert("Error fetching job details");
    }
  };

  const showToast = () => {
    const toastLiveExample = document.getElementById("liveToast");
    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  };

  // Function to calculate the size of the progress bar based on the recruitment tracker value
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

  // Function to get the text to display based on the recruitment tracker value
  const getTrackerText = (trackerValue) => {
    switch (trackerValue) {
      case 1:
        return "Applicant needs to be reviewed.";
      case 2:
        return "Applicant has been reviewed, please recommend a job to them.";
      case 3:
        return "A job has been recommended to this applicant, waiting for them to inquire about this job.";
      case 4:
        return "Applicant has inquired about the job, please contact them to discuss further.";
      case 5:
        return "Applicant has been contacted.";
      default:
        return "";
    }
  };

  if (!isStaff) {
    return null;
  }

  // Function to download an applicant's cv
  const downloadCV = (applicantId, fileName) => {
    fetch(`/applicant/applicant/${applicantId}/cv/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) =>
        console.error("Unable to download applicant cv", error)
      );
  };

  // Function to get the name of the cv file and allow the employee to download it
  const returncvname = (filePath) => {
    return filePath.split("\\").pop().split("/").pop();
  };

  return (
    <Authorisedroute>
      <div
        style={{
          backgroundColor: "#343a40",
          minHeight: "100vh",
          color: "white",
          padding: "20px",
        }}
      >
        <h1 className="my-4">List of Applicants</h1>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              {ApplicantDetails.map((details) => (
                <div
                  key={details.id}
                  className={`col-md-4 mb-4 ${
                    details.recruitmenttracker <= 1 ? "border-danger" : ""
                  }`}
                  style={{
                    border:
                      details.recruitmenttracker <= 1 ? "2px solid red" : "none",
                    margin: "5px",
                  }}
                >
                  <div className="card bg-dark text-white">
                    <div className="card-body">
                      <h5 className="card-title">{details.fullname}</h5>
                      <p className="card-text">
                        <strong>Email:</strong> {details.email}
                      </p>
                      <p className="card-text">
                        <strong>Phone:</strong> 0{details.phonenumber}
                      </p>
                      <p className="card-text">
                        <strong>Skills:</strong>
                      </p>
                      <ul>
                        {details.skills ? (
                          details.skills
                            .split(",")
                            .map((skill, index) => <li key={index}>{skill}</li>)
                        ) : (
                          <li>No skills listed</li>
                        )}
                      </ul>
                      <p className="card-text">
                        <strong>Qualifications:</strong> {details.qualifications}
                      </p>
                      <p className="card-text">
                        <strong>Preferences:</strong> {details.preferences}
                      </p>
                      <ul>
                        {details.cv ? (
                          <button
                            onClick={() =>
                              downloadCV(details.id, returncvname(details.cv))
                            }
                          >
                            Download CV
                          </button>
                        ) : (
                          <li>No CV uploaded</li>
                        )}
                      </ul>
                      {details.recruitmenttracker <= 1 ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => markasreviewed(details.email)}
                        >
                          Applicant reviewed?
                        </button>
                      ) : (
                        <p className="text-success">
                          This applicant has been reviewed already!
                        </p>
                      )}
                      <div className="progress mt-3">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: calculateProgress(details.recruitmenttracker).width }}
                          aria-valuenow={parseInt(calculateProgress(details.recruitmenttracker).width)}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {calculateProgress(details.recruitmenttracker).label}
                        </div>
                      </div>
                      <p className="mt-2">{getTrackerText(details.recruitmenttracker)}</p>
                      <p className="mt-2">
                        <strong>Shortlisted for Job:</strong> {JobRecommendations.find(rec => rec.applicant_id === details.id)?.jobTitle || "None"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h5 className="card-title">Shortlist applicants</h5>
                <ul>This algorithm will quickly shortlist applicants with a job that may best suit them for that role.</ul>
                <ul> This tool may recommend a different job to an applicant each time it is used, however this algorithm will run a number of times to determine the best job.</ul>
                <button className="btn btn-primary mb-3" onClick={fetchRecommendations}>
                  Use Algorithm
                </button>
                {loading && (
                  <div className="spinner-grow text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                {noApplicantsMessage && (
                  <p className="text-warning">{noApplicantsMessage}</p>
                )}
                {Recommendations.length > 0 && (
                  <div>
                    {Recommendations.map((rec, index) => (
                      <div key={index}>
                        <p><strong>Name:</strong> {rec.name}</p>
                        <p><strong>Email:</strong> {rec.email}</p>
                        <p><strong>Recommended Job:</strong> {rec.jobTitle}</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => showJobDetails(rec.recommendedJobId)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => updateRecruitmentTracker(rec.email, rec.recommendedJobId)}
                        >
                          Recommend this job to applicant
                        </button>
                        <hr />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <h2 className="my-4">Applicants to Contact</h2>
        <div className="row">
          {ApplicantsToContact.map((details) => (
            <div
              key={details.id}
              className="col-md-4 mb-4"
              style={{
                border: "2px solid blue",
                margin: "5px",
              }}
            >
              <div className="card bg-dark text-white">
                <div className="card-body">
                  <h5 className="card-title">{details.fullname}</h5>
                  <p className="card-text">
                    <strong>Email:</strong> {details.email}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => markAsContacted(details.email)}
                  >
                    Mark as Contacted
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <strong className="me-auto">Job Details</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <p><strong>Job Title:</strong> {jobDetails.jobtitle}</p>
            <p><strong>Company:</strong> {jobDetails.companyname}</p>
            <p><strong>Job Type:</strong> {jobDetails.jobtype}</p>
            <p><strong>Salary:</strong> £{jobDetails.salary}</p>
            <p><strong>Job Description:</strong> {jobDetails.jobdescription}</p>
            <p><strong>Location:</strong> {jobDetails.location}</p>
            <p><strong>Date Posted:</strong> {jobDetails.dateposted}</p>
            <p><strong>Deadline:</strong> {jobDetails.deadline}</p>
            <p><strong>Skills:</strong> {jobDetails.jobprimaryskill}, {jobDetails.jobsecondaryskill}</p>
          </div>
        </div>
      </div>
    </Authorisedroute>
  );
};

export default ListApplicants;