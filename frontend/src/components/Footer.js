import React, { useEffect, useState } from "react";

const Footer = () => {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const retrievestaffstatus = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await fetch("/applicant/retrieve-staff-status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsStaff(data.is_staff);
        }
      }
    };
    retrievestaffstatus();
  }, []);
  return (
    <nav className="navbar fixed-bottom navbar-expand-lg navbar-dark bg-dark">
      <div className="container-md">
        <a className="navbar-brand" href="/">
          {isStaff
            ? "Employee Portal"
            : "Templewood Recruitment Applicant Portal - Copyright © 2018 Templewood, All Rights Reserved. Registered No: 10041372"}
        </a>
      </div>
    </nav>
  );
};

export default Footer;
