import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Authorisedroute from "../components/Authorisedroute";
import api from "../api";

//function to allow applicants to fill out their details
const ApplicantDetails = () => {
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
  const [cv, setcv] = useState(null);
  const [cvError, setCvError] = useState("");
  const [skillError, setSkillError] = useState(false);
  const [phonenumberError, setPhonenumberError] = useState(false);

  const navigate = useNavigate();

  // Fetch the currently logged-in user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await api.get("/applicant/retrieve-staff-status");
        if (response.status === 200) {
          setemail(response.data.email);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };
    fetchUserEmail();
  }, []);
  const validatePhoneNumber = (number) => {
    const isNumeric = /^\d+$/.test(number);
    if (number.length !== 10 || !isNumeric) {
      setPhonenumberError(true);
    } else {
      setPhonenumberError(false);
    }
  };
  const validateSkills = () => {
    const skills = [skill_1, skill_2, skill_3, skill_4, skill_5];
    const uniqueSkills = new Set(skills.filter(skill => skill !== ""));
    if (uniqueSkills.size !== skills.filter(skill => skill !== "").length) {
      setSkillError("Please ensure that no skill is repeated.");
      return false;
    } else {
      setSkillError("");
      return true;
    }
  };
  //function to send the applicant details to the backend
  const sendApplicantDetails = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity() || !validateSkills()) {
      e.stopPropagation();
      e.target.classList.add('was-validated');
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("phonenumber", phonenumber);
    formData.append("skill_1", skill_1);
    formData.append("skill_2", skill_2);
    formData.append("skill_3", skill_3);
    formData.append("skill_4", skill_4);
    formData.append("skill_5", skill_5);
    formData.append("qualifications", qualifications);
    formData.append("preferences", preferences);
    formData.append("cv", cv);
    formData.append("recruitmenttracker", 1);

    //sends the data to the backend 
    try {
      //gets the server time
      const timeResponse = await api.get("/applicant/servertime");
      if (timeResponse.status === 200) {
        const serverTime = timeResponse.data.server_time;
        formData.append("timestamp", serverTime);
  
        const response = await api.post("/applicant/details/", formData);
        if (response.status === 201) {
          alert("Details updated!");
          navigate("/applicant/details/");
          window.location.reload();
        } else {
          alert("Failed to update details!", response.data);
        }
      } else {
        alert("There was an error communicating with the backend server, please try again later!");
      }
    } catch (error) {
      console.error("Error updating applicant details:", error);
    }
  };

  // This function is code taken directly off of bootstrap's docs to use their form validation styling in my code -> https://getbootstrap.com/docs/5.0/forms/validation/
  (() => {
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  })();
  // end of code taken from bootstrap docs

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = /(\.pdf|\.docx|\.doc)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setCvError("Please upload a file in .pdf, .doc or .docx format.");
      setcv(null);
    } else {
      setCvError("");
      setcv(file);
    }
  };

  const skillOptions = [
    "Adult Social Care",
    "Child Social Care",
    "Elderly Social Care",
    "Hospital/GP Experience",
    "Managerial Experience",
    "Technological Experience",
    "Physiotherapy",
    "Doctorate",
    "Surgeon",
    "Nursing"
  ];

  return (
    <Authorisedroute>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2>Fill out your details!</h2>
            <p>Fields marked with '*' are required.</p>
            <div
              className="form-box"
              style={{ maxHeight: "600px", overflowY: "auto" }}
            >
              <form
                onSubmit={sendApplicantDetails}
                className="row g-3 needs-validation"
                noValidate
              >
                <div className="mb-3">
                  <label className="form-label">Full name*</label>
                  <input
                    className="form-control"
                    id="fullname"
                    onChange={(e) => setfullname(e.target.value)}
                    value={fullname}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter your first name and your surname!
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
                    value={email}
                    readOnly
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter a valid email address!
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="phonenumber" className="form-label">
                    Phone Number*
                  </label>
                  <input
                    className={`form-control ${phonenumberError ? "is-invalid" : ""}`}
                    id="phonenumber"
                    onChange={(e) => {
                      setphonenumber(e.target.value);
                      validatePhoneNumber(e.target.value);
                   }}
                    value={phonenumber}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter a valid phone number! (Don't include a 0 at the start)
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="skill_1" className="form-label">
                    Experience in what fields?*
                  </label>
                  <select
                    className="form-select"
                    id="skill_1"
                    onChange={(e) => setskill_1(e.target.value)}
                    value={skill_1}
                    required
                  >
                    <option value="">Select a field</option>
                    {skillOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>
                {skillError && <div className="text-danger">{skillError}</div>}
                <div className="mb-3">
                  <label htmlFor="skill_2" className="form-label">
                    Experience in what fields?*
                  </label>
                  <select
                    className="form-select"
                    id="skill_2"
                    onChange={(e) => setskill_2(e.target.value)}
                    value={skill_2}
                    required
                  >
                    <option value="">Select a field</option>
                    {skillOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>
                {skillError && <div className="text-danger">{skillError}</div>}
                <div className="mb-3">
                  <label htmlFor="skill_3" className="form-label">
                    Experience in what fields? (Optional)
                  </label>
                  <select
                    className="form-select"
                    id="skill_3"
                    onChange={(e) => setskill_3(e.target.value)}
                    value={skill_3}
                  >
                    <option value="">Select a field</option>
                    {skillOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {skillError && <div className="text-danger">{skillError}</div>}
                <div className="mb-3">
                  <label htmlFor="skill_4" className="form-label">
                    Experience in what fields? (Optional)
                  </label>
                  <select
                    className="form-select"
                    id="skill_4"
                    onChange={(e) => setskill_4(e.target.value)}
                    value={skill_4}
                  >
                    <option value="">Select a field</option>
                    {skillOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {skillError && <div className="text-danger">{skillError}</div>}
                <div className="mb-3">
                  <label htmlFor="skill_5" className="form-label">
                    Experience in what fields? (Optional)
                  </label>
                  <select
                    className="form-select"
                    id="skill_5"
                    onChange={(e) => setskill_5(e.target.value)}
                    value={skill_5}
                  >
                    <option value="">Select a field</option>
                    {skillOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                {skillError && <div className="text-danger">{skillError}</div>}
                <div className="mb-3">
                  <label htmlFor="qualifications" className="form-label">
                    Qualifications:*
                  </label>
                  <textarea className="form-control" id="qualifications"onChange={(e) => setqualifications(e.target.value)} value={qualifications} required />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter your qualifications!
                  </div>
                </div> 
                <div className="mb-3">
                  <label htmlFor="preferences" className="form-label">
                    Preferences*
                  </label>
                  <select className="form-select" id="preferences" onChange={(e) => setpreferences(e.target.value)} value={preferences} required>
                    <option value="">Select a preference</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a preference!</div>
                </div>
                <div className="form-group">
                  <label htmlFor="cv">Upload a CV* (Accepted formats: .pdf, .docx)</label>
                  <br />
                  <input type="file" id="cv" name="cv" onChange={handleCvChange} required />
                  {cvError && <div className="text-danger">{cvError}</div>}
                </div>
                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Authorisedroute>
  );
};

export default ApplicantDetails;
