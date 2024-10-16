import React, { useEffect, useState } from "react";
import Authorisedroute from "../components/Authorisedroute";
import DetailsDisplay from "../webpages/DetailsDisplay";
import api from "../api";

const ApplicantDetails = () => {
  const [applicantDetails, setApplicantDetails] = useState([]);
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [skill_1, setskill_1] = useState("");
  const [skill_2, setskill_2] = useState("");
  const [skill_3, setskill_3] = useState("");
  const [skill_4, setskill_4] = useState("");
  const [skill_5, setskill_5] = useState("");
  const [qualifications, setqualifications] = useState("");
  const [preferences, setpreferences] = useState("");
  const [cv, setcv] = useState("");

  useEffect(() => {
    getApplicantDetails();
  }, []);

  const deleteApplicantDetails = (id) => {
    api.delete(`/applicant/details/delete/${id}/`).then((res) => {
      if (res.status === 204) {
        alert("Applicant details deleted successfully");
        getApplicantDetails();
      } else {
        alert("Error deleting applicant details");
      }
    });
  };

  const sendApplicantDetails = (e) => {
    e.preventDefault();
    api
      .post("/applicant/details/", {
        fullname,
        email,
        phonenumber,
        skill_1,
        skill_2,
        skill_3,
        skill_4,
        skill_5,
        qualifications,
        preferences,
        cv,
      })
      .then((res) => {
        getApplicantDetails();
        if (res.status === 201) {
          alert("Applicant details sent successfully");
        } else {
          alert("Error sending applicant details");
        }
      })
      .catch((err) => {
        console.error("Error sending applicant details", err);
        alert(err.message)
    });
  };

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

  return (
    <Authorisedroute>
      <div>Your Profile:</div>
      {applicantDetails.map((applicantDetails) => (
        <DetailsDisplay
          applicantdetails={applicantDetails}
          onDelete={deleteApplicantDetails}
          key={applicantDetails.id}
        />
      ))}
      <h2>Fill out your details!</h2>
      <form onSubmit={sendApplicantDetails}>
        <div className="mb-3">
          <label htmlFor="fullname" className="form-label">
            Full Name
          </label>
          <input
            type="username"
            className="form-control"
            id="fullname"
            onChange={(e) => setfullname(e.target.value)}
            value={fullname}
            required
          />
          <div id="emailHelp" className="form-text">
            Please enter your full name
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phonenumber" className="form-label">
            Phone Number
          </label>
          <input
            className="form-control"
            id="phonenumber"
            onChange={(e) => setphonenumber(e.target.value)}
            value={phonenumber}
            required
          />
        </div>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
          id="skill_1"
          onChange={(e) => setskill_1(e.target.value)}
          value={skill_1}
          required
        >
          <option selected>Experience in what fields?</option>
          <option value="1">Adult Social Care</option>
          <option value="2">Child Social Care</option>
          <option value="3">Elderly Social Care</option>
          <option value="4">Hospital/GP Experience</option>
          <option value="5">Manegerial Experience</option>
          <option value="6">Technological Experience</option>
          <option value="7">Physiotherapy</option>
          <option value="8">Doctorate</option>
          <option value="9">Surgeon</option>
          <option value="10">Nursing</option>
        </select>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
          id="skill_2"
          onChange={(e) => setskill_2(e.target.value)}
          value={skill_2}
          required
        >
          <option selected>Experience in what fields?</option>
          <option value="1">Adult Social Care</option>
          <option value="2">Child Social Care</option>
          <option value="3">Elderly Social Care</option>
          <option value="4">Hospital/GP Experience</option>
          <option value="5">Manegerial Experience</option>
          <option value="6">Technological Experience</option>
          <option value="7">Physiotherapy</option>
          <option value="8">Doctorate</option>
          <option value="9">Surgeon</option>
          <option value="10">Nursing</option>
        </select>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
          id="skill_3"
          onChange={(e) => setskill_3(e.target.value)}
          value={skill_3}
          required
        >
          <option selected>Experience in what fields?</option>
          <option value="1">Adult Social Care</option>
          <option value="2">Child Social Care</option>
          <option value="3">Elderly Social Care</option>
          <option value="4">Hospital/GP Experience</option>
          <option value="5">Manegerial Experience</option>
          <option value="6">Technological Experience</option>
          <option value="7">Physiotherapy</option>
          <option value="8">Doctorate</option>
          <option value="9">Surgeon</option>
          <option value="10">Nursing</option>
        </select>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
          id="skill_4"
          onChange={(e) => setskill_4(e.target.value)}
          value={skill_4}
          required
        >
          <option selected>Experience in what fields?</option>
          <option value="1">Adult Social Care</option>
          <option value="2">Child Social Care</option>
          <option value="3">Elderly Social Care</option>
          <option value="4">Hospital/GP Experience</option>
          <option value="5">Manegerial Experience</option>
          <option value="6">Technological Experience</option>
          <option value="7">Physiotherapy</option>
          <option value="8">Doctorate</option>
          <option value="9">Surgeon</option>
          <option value="10">Nursing</option>
        </select>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
          id="skill_5"
          onChange={(e) => setskill_5(e.target.value)}
          value={skill_5}
          required
        >
          <option selected>Experience in what fields?</option>
          <option value="1">Adult Social Care</option>
          <option value="2">Child Social Care</option>
          <option value="3">Elderly Social Care</option>
          <option value="4">Hospital/GP Experience</option>
          <option value="5">Manegerial Experience</option>
          <option value="6">Technological Experience</option>
          <option value="7">Physiotherapy</option>
          <option value="8">Doctorate</option>
          <option value="9">Surgeon</option>
          <option value="10">Nursing</option>
        </select>
        <div className="mb-3">
          <label htmlFor="qualifications" className="form-label">
            Qualifications:
          </label>
          <input
            className="form-control"
            id="qualifications"
            onChange={(e) => setqualifications(e.target.value)}
            value={qualifications}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="preferences" className="form-label">
            Preferences:
          </label>
          <input
            className="form-control"
            id="preferences"
            onChange={(e) => setpreferences(e.target.value)}
            value={preferences}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" value="Submit">
          Submit
        </button>
      </form>
    </Authorisedroute>
  );
};

export default ApplicantDetails;
