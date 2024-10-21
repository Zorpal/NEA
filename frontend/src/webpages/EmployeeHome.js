import React from "react";
import Authorisedroute from "../components/Authorisedroute";

const EmployeeHome = () => {
    const spacing = 18;
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
                            Templewood Recruitment Ltd are a leading independent recruitment
                            consultancy, specialising in the supply of high calibre Temporary,
                            Contract and Permanent staff within the Professional Services and
                            Health & Social Care sectors.
                        </p>
                        <p className="card-text">
                            Created and run by a senior management team, benefiting from over
                            50 years of recruitment expertise; our goal is to provide a world
                            className and highly effective service to both our clients and
                            candidates. Striving to ‘wow’ our customers in every interaction;
                            our long term vision is to positively challenge the status quo
                            within the recruitment industry and to firmly establish Templewood
                            Recruitment as a trusted business partner and the definitive
                            agency of choice for our service users.
                        </p>
                        <a
                            className="btn btn-primary"
                            href="https://www.templewoodrecruitment.co.uk"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Our Website
                        </a>
                    </div>
                </div>
            </div>
        </Authorisedroute>
    );
};

export default EmployeeHome;
