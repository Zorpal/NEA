import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ApplicantContext from "../context/ApplicantContext";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState([]);

  
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  }

  const getJob = () => {
    fetch(`/Jobs/List/${jobId}`)
      .then(response => response.json())
      .then(data => {
        setJob(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (jobId) {
      getJob();
    }
  }, [jobId]);

  return (
    <div className="card">
      <div className="card-header">{job.jobtitle} - Job at {job.companyname}</div>
      <div className="card-body">
        <p className="card-text">
          Job Type: {job.jobtype}
        </p>
        <p className="card-text">
          Salary: £{job.salary}
        </p>
        <p className="card-text">
          Job Description: {job.jobdescription}
        </p>
        <p className="card-text">
          Location: {job.location}
        </p>
        <p className="card-text">
          Date listing was posted: {job.dateposted}
        </p>
        <p className="card-text">
          Deadline to apply: {job.deadline}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;