import React, { useEffect, useState } from "react";
import Authorisedroute from "../components/Authorisedroute";
import DetailsDisplay from "../webpages/DetailsDisplay";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

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
  const [cv, setcv] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    setToken(storedToken);
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

  const sendApplicantDetails = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Token:", token);
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
        getApplicantDetails();
      } else {
        alert("Failed to update details!", data);
        console.error("Error updating applicant details:", data.error);
      }
    } catch (error) {
      console.error("Error updating applicant details:", error);
    }
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
                    <div className="invalid-feedback">
                      Please select a field!
                    </div>
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
                      <div className="invalid-feedback">
                        Please select a field!
                      </div>
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
                      <div className="invalid-feedback">
                        Please select a field!
                      </div>
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
                      <div className="invalid-feedback">
                        Please select a field!
                      </div>
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
                      <div className="invalid-feedback">
                        Please select a field!
                      </div>
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
                      Preferences:
                    </label>
                    <textarea
                      className="form-control"
                      id="preferences"
                      onChange={(e) => setpreferences(e.target.value)}
                      value={preferences}
                      required
                    />
                    <div className="valid-feedback">Looks good!</div>
                    <div className="invalid-feedback">
                      Please enter your preferences!
                    </div>
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
                </form>
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-3"
                onClick={sendApplicantDetails}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
    </Authorisedroute>
  );
};

export default ApplicantDetails;
