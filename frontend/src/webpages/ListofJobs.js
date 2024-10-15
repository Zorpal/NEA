import React, { useEffect, useState } from "react";
import{Link} from "react-router-dom";

const ListofJobs = () => {
  const [jobs, setJobs] = useState([]);
  const getJobs = () => {
    fetch("/Jobs/List/")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <ul className="list-group">
      {jobs.map((job, index) => (
        <li key={index} className="list-group-item">
          <Link to={`/Jobs/List/${job.id}`}>
            {job.jobtitle}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ListofJobs;
