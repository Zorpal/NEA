import React from "react";

function returnDetails({ applicantdetails, onDelete }) {

  return (
    <div className="details-container">
      <p className="details-fullname">{applicantdetails.fullname}</p>
      <p className="details-email">{applicantdetails.email}</p>
      <p className="details-phonenumber">{applicantdetails.phonenumber}</p>
      <p className="details-skill_1">{applicantdetails.skill_1}</p>
      <p className="details-skill_2">{applicantdetails.skill_2}</p>
      <p className="details-skill_3">{applicantdetails.skill_3}</p>
      <p className="details-skill_4">{applicantdetails.skill_4}</p>
      <p className="details-skill_5">{applicantdetails.skill_5}</p>
      <p className="details-qualifications">{applicantdetails.qualifications}</p>
      <p className="details-preferences">{applicantdetails.preferences}</p>
      <p className="details-cv">{applicantdetails.cv}</p>

      <button
        className="delete-button"
        onClick={() => onDelete(applicantdetails.id)}
      >
        Erase details
      </button>
    </div>
  );
}

export default returnDetails;
