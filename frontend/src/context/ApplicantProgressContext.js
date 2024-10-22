
import React, { createContext, useState } from "react";

const ApplicantProgressContext = createContext();

const ApplicantProgressProvider = ({ children }) => {
  const [ApplicantProgress, setApplicantProgress] = useState(0);

  return (
    <ApplicantProgressContext.Provider value={{ ApplicantProgress, setApplicantProgress }}>
      {children}
    </ApplicantProgressContext.Provider>
  );
};

export { ApplicantProgressContext, ApplicantProgressProvider };
