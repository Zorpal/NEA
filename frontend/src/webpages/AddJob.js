import React, { useState, useEffect } from "react";
import Authorisedroute from "../components/Authorisedroute";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";


const AddJob = () => {
  const [jobtitle, setjobtitle] = useState("");
  const [companyname, setcompanyname] = useState("");
  const [salary, setsalary] = useState("");
  const [jobdescription, setjobdescription] = useState("");
  const [dateposted, setdateposted] = useState("");
  const [location, setlocation] = useState("");
  const [jobtype, setjobtype] = useState("");
  const [deadline, setdeadline] = useState("");
  const [jobprimaryskill, setjobprimaryskill] = useState("");
  const [jobsecondaryskill, setjobsecondaryskill] = useState("");
  const jobsuitablefor = 0
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    setToken(storedToken);
  }, []);

  const sendJobDetails = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Token:", token);
    const formData = new FormData();
    formData.append("jobtitle", jobtitle);
    formData.append("companyname", companyname);
    formData.append("salary", salary);
    formData.append("jobdescription", jobdescription);
    formData.append("dateposted", dateposted);
    formData.append("location", location);
    formData.append("jobtype", jobtype);
    formData.append("deadline", deadline);
    formData.append("jobprimaryskill", jobprimaryskill);
    formData.append("jobsecondaryskill", jobsecondaryskill);
    formData.append("jobsuitablefor", jobsuitablefor)

    try {
      const response = await fetch(`/Jobs/Update/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Job listing added!");
        navigate("/employee/home/");
        window.location.reload();
      } else {
        alert("Failed to send job!", data);
        console.error("Error updating job details:", data.error);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating job details:", error);
    }
  };

  return (
    <Authorisedroute>
      <div className="container mt-5">
        <h2 className="text-center">Add Job</h2>
        <div
          className="form-box"
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <form
            onSubmit={sendJobDetails}
            className="needs-validation"
            noValidate
          >
            <div className="mb-3">
              <label htmlFor="jobtitle" className="form-label">
                Job Title
              </label>
              <input
                type="text"
                className="form-control"
                id="jobtitle"
                name="jobtitle"
                value={jobtitle}
                onChange={(e) => setjobtitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="companyname" className="form-label">
                Company Name
              </label>
              <input
                type="text"
                className="form-control"
                id="companyname"
                name="companyname"
                value={companyname}
                onChange={(e) => setcompanyname(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="salary" className="form-label">
                Salary
              </label>
              <input
                type="number"
                className="form-control"
                id="salary"
                name="salary"
                value={salary}
                onChange={(e) => setsalary(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="jobdescription" className="form-label">
                Job Description
              </label>
              <textarea
                className="form-control"
                id="jobdescription"
                name="jobdescription"
                value={jobdescription}
                onChange={(e) => setjobdescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="dateposted" className="form-label">
                Date Posted
              </label>
              <input
                type="date"
                className="form-control"
                id="dateposted"
                name="dateposted"
                value={dateposted}
                onChange={(e) => setdateposted(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setlocation(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="jobtype" className="form-label">
                Job Type
              </label>
              <input
                type="text"
                className="form-control"
                id="jobtype"
                name="jobtype"
                value={jobtype}
                onChange={(e) => setjobtype(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deadline" className="form-label">
                Deadline
              </label>
              <input
                type="date"
                className="form-control"
                id="deadline"
                name="deadline"
                value={deadline}
                onChange={(e) => setdeadline(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="jobprimaryskill" className="form-label">
                Primary Skill
              </label>
              <select
                className="form-control"
                id="jobprimaryskill"
                name="jobprimaryskill"
                value={jobprimaryskill}
                onChange={(e) => setjobprimaryskill(e.target.value)}
                required
              >
                <option value="">Select Primary Skill</option>
                <option value="Adult Social Care">Adult Social Care</option>
                <option value="Child Social Care">Child Social Care</option>
                <option value="Elderly Social Care">Elderly Social Care</option>
                <option value="Hospital/GP Experience">
                  Hospital/GP Experience
                </option>
                <option value="Manegerial Experience">
                  Manegerial Experience
                </option>
                <option value="Technological Experience">
                  Technological Experience
                </option>
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Nursing">Nursing</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="jobsecondaryskill" className="form-label">
                Secondary Skill
              </label>
              <select
                className="form-control"
                id="jobsecondaryskill"
                name="jobsecondaryskill"
                value={jobsecondaryskill}
                onChange={(e) => setjobsecondaryskill(e.target.value)}
                required
              >
                <option value="">Select Secondary Skill</option>
                <option value="Adult Social Care">Adult Social Care</option>
                <option value="Child Social Care">Child Social Care</option>
                <option value="Elderly Social Care">Elderly Social Care</option>
                <option value="Hospital/GP Experience">
                  Hospital/GP Experience
                </option>
                <option value="Manegerial Experience">
                  Manegerial Experience
                </option>
                <option value="Technological Experience">
                  Technological Experience
                </option>
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Nursing">Nursing</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={sendJobDetails}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </Authorisedroute>
  );
};
export default AddJob;
