import React, {useEffect, useState} from "react";
import Authorisedroute from "../components/Authorisedroute";
import { useNavigate } from "react-router-dom";
import api from "../api";

//Renders some html to give employees some basic information on the functions in the navbar. Also implemented authorised route so only employees can access this page
const EmployeeHome = () => {
    const spacing = 18;
    const [isStaff, setIsStaff] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const retrievestaffstatus = async () => {
          try {
            const response = await api.get("/applicant/retrieve-staff-status");
            if (response.status === 200) {
              setIsStaff(response.data.is_staff);
              if (!response.data.is_staff) {
                navigate("/");
              }
            }
          } catch (error) {
            console.error("Error retrieving staff status:", error);
            navigate("/");
          }
        };
        retrievestaffstatus();
      }, [navigate]);

      if (!isStaff) {
        return null;
      }
    return (
        <Authorisedroute>
            <div
                style={{
                    backgroundColor: "#343a40",
                    minHeight: "100vh",
                    color: "white",
                    padding: spacing,
                }}
            >
                <div className="card bg-dark text-white" style={{ margin: 0 }}>
                    <div className="card-body">
                        <h5 className="card-title">TRL Employee Home</h5>
                        <p className="card-text">
                            To view the list of applicants who have submitted details, click on <strong>Applicants</strong>
                        </p>
                        <p className="card-text">
                            To view the list of jobs and to see a list of applicants suitable for those jobs, click on <strong>Jobs</strong>
                        </p>
                        <p className="card-text">
                            To create a new job, click on <strong>Add a Job</strong>
                        </p>
                        <p className="card-text">
                            To view the non-employee home page, click on the <strong>logo</strong>
                        </p>
                    </div>
                </div>
            </div>
        </Authorisedroute>
    );
};

export default EmployeeHome;
