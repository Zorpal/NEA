import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Authorisedroute from "../components/Authorisedroute";
import { ACCESS_TOKEN } from "../constants";
import { ApplicantProgressContext } from "../context/ApplicantProgressContext";

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
  const [token, setToken] = useState(null);
  const {setApplicantProgress} = useContext(ApplicantProgressContext)
  const {ApplicantProgress} = useContext(ApplicantProgressContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    setToken(storedToken);
  }, []);

  const sendApplicantDetails = async (e) => {
    e.preventDefault();
    console.log("progress: ", ApplicantProgress)
    setApplicantProgress(1)
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
    formData.append("recruitmentstage", 1);

    try {
      const response = await fetch(`/applicant/details/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Details updated!");
        console.log("Applicant progress set to 1")


        navigate("/applicant/details/");
        window.location.reload();
      } else {
        alert("Failed to update details!", data);
        console.error("Error updating applicant details:", data.error);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating applicant details:", error);
    }
  };

  // This function is code taken directly off of bootstrap's docs to use their form validation styling in my code -> https://getbootstrap.com/docs/5.0/forms/validation/
  (() => {
    "use strict";
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

  return (
    <Authorisedroute>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2>Fill out your details!</h2>
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
                  <label className="form-label">Full name</label>
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
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter a valid email address!
                  </div>
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
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter a valid phone number!
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="skill_1" className="form-label">
                    Experience in what fields?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skill_1"
                    list="skill_1_options"
                    onChange={(e) => setskill_1(e.target.value)}
                    value={skill_1}
                    required
                  />
                  <datalist id="skill_1_options">
                    <option value="Adult Social Care" />
                    <option value="Child Social Care" />
                    <option value="Elderly Social Care" />
                    <option value="Hospital/GP Experience" />
                    <option value="Manegerial Experience" />
                    <option value="Technological Experience" />
                    <option value="Physiotherapy" />
                    <option value="Doctorate" />
                    <option value="Surgeon" />
                    <option value="Nursing" />
                  </datalist>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="skill_2" className="form-label">
                    Experience in what fields?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skill_2"
                    list="skill_2_options"
                    onChange={(e) => setskill_2(e.target.value)}
                    value={skill_2}
                  />
                  <datalist id="skill_2_options">
                    <option value="Adult Social Care" />
                    <option value="Child Social Care" />
                    <option value="Elderly Social Care" />
                    <option value="Hospital/GP Experience" />
                    <option value="Manegerial Experience" />
                    <option value="Technological Experience" />
                    <option value="Physiotherapy" />
                    <option value="Doctorate" />
                    <option value="Surgeon" />
                    <option value="Nursing" />
                  </datalist>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="skill_3" className="form-label">
                    Experience in what fields?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skill_3"
                    list="skill_3_options"
                    onChange={(e) => setskill_3(e.target.value)}
                    value={skill_3}
                  />
                  <datalist id="skill_3_options">
                    <option value="Adult Social Care" />
                    <option value="Child Social Care" />
                    <option value="Elderly Social Care" />
                    <option value="Hospital/GP Experience" />
                    <option value="Manegerial Experience" />
                    <option value="Technological Experience" />
                    <option value="Physiotherapy" />
                    <option value="Doctorate" />
                    <option value="Surgeon" />
                    <option value="Nursing" />
                  </datalist>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="skill_4" className="form-label">
                    Experience in what fields?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skill_4"
                    list="skill_4_options"
                    onChange={(e) => setskill_4(e.target.value)}
                    value={skill_4}
                  />
                  <datalist id="skill_4_options">
                    <option value="Adult Social Care" />
                    <option value="Child Social Care" />
                    <option value="Elderly Social Care" />
                    <option value="Hospital/GP Experience" />
                    <option value="Manegerial Experience" />
                    <option value="Technological Experience" />
                    <option value="Physiotherapy" />
                    <option value="Doctorate" />
                    <option value="Surgeon" />
                    <option value="Nursing" />
                  </datalist>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="skill_5" className="form-label">
                    Experience in what fields?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skill_5"
                    list="skill_5_options"
                    onChange={(e) => setskill_5(e.target.value)}
                    value={skill_5}
                  />
                  <datalist id="skill_5_options">
                    <option value="Adult Social Care" />
                    <option value="Child Social Care" />
                    <option value="Elderly Social Care" />
                    <option value="Hospital/GP Experience" />
                    <option value="Manegerial Experience" />
                    <option value="Technological Experience" />
                    <option value="Physiotherapy" />
                    <option value="Doctorate" />
                    <option value="Surgeon" />
                    <option value="Nursing" />
                  </datalist>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a field!</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="qualifications" className="form-label">
                    Qualifications:
                  </label>
                  <textarea
                    className="form-control"
                    id="qualifications"
                    onChange={(e) => setqualifications(e.target.value)}
                    value={qualifications}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter your qualifications!
                  </div>
                </div> 
                <div className="mb-3">
                  <label htmlFor="preferences" className="form-label">
                    Preferences
                  </label>
                  <select
                    className="form-select"
                    id="preferences"
                    onChange={(e) => setpreferences(e.target.value)}
                    value={preferences}
                    required
                  >
                    <option value="">Select a preference</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">Please select a preference!</div>
                </div>
                <div className="form-group">
                  <label htmlFor="cv">Upload a CV</label>
                  <br />
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    onChange={(e) => setcv(e.target.files[0])}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Authorisedroute>
  );
};

export default ApplicantDetails;
