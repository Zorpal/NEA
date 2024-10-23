import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


// Functional component "ListofJobs" to be called upon in my website by exporting it.
const ListofJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filter, setFilter] = useState("");
  // State constants defined to be used in this file

  // Function to GET (fetch) each job from my database through django's API
  const getJobs = () => {
    fetch("/Jobs/List/")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // React's "useEffect" hook to call upon my getJobs function
  useEffect(() => {
    getJobs();
  }, []);

  // Sorting algorithm using react's "useEffect" hook to allow applicant to filter jobs displayed by their "jobtype" attribute
  useEffect(() => {
    if (filter) {
      setFilteredJobs(jobs.filter((job) => job.jobtype === filter));
    } else {
      setFilteredJobs(jobs);
    }
  }, [filter, jobs]);

  // e is short for event, used e to contain the object returned by the event handler
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const width = {
    width: "18rem",
  };

  return (
    <div>
      <div className="dropdown filter-container" style={{ marginBottom: "2rem" }}>
        <label className="" htmlFor="job-filter">
          <strong>
            Filter by job type: {" "}
          </strong>
        </label>
        <select
          className="btn btn-secondary dropdown-toggle"
          id="job-filter"
          onChange={handleFilterChange}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">All</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Seasonal">Seasonal</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>
      <div className="card-group">
        <ul
          className="card-group"
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          {filteredJobs.map((job, index) => (
            <li
              key={index}
              className="card-group"
              style={{ marginBottom: "1rem" }}
            >
              <div className="card" style={width}>
                <div className="card-body">
                  <h5 className="card-title">{job.jobtitle}</h5>
                  <p className="card-text">{job.jobdescription}</p>
                </div>
                <Link className="btn btn-primary" to={`/Jobs/List/${job.id}`}>
                  {job.jobtitle}
                </Link>
                <div className="card-footer">
                  <small className="text-body-secondary">
                    Last updated {job.dateposted}
                  </small>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListofJobs;
