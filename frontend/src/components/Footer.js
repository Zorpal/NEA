import React, { useEffect, useState } from "react";
import api from "../api";

//function to display a footer with the contents depending on the logged in user
const Footer = () => {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const retrievestaffstatus = async () => {
      try {
        const response = await api.get("/applicant/retrieve-staff-status");

        if (response.status === 200) {
          const data = response.data;
          setIsStaff(data.is_staff);
        }
      } catch (error) {
        console.error("Failed to retrieve staff status", error);
      }
    };
    retrievestaffstatus();
  }, []);
//renders the footer 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-md">
        <a className="navbar-brand" href="/">
          {isStaff
            ? "Employee Portal - Templewood Recruitment - Copyright © 2018 Templewood, All Rights Reserved. Registered No: 10041372"
            : "Templewood Recruitment Applicant Portal - Copyright © 2018 Templewood, All Rights Reserved. Registered No: 10041372"}
        </a>
      </div>
    </nav>
  );
};

export default Footer;
