import React, { useEffect, useState } from "react";
import api from "../api";
import Authorisedroute from "../components/Authorisedroute";

const ListApplicants = () => {
    const [ApplicantDetails, setApplicantDetails] = useState([]);

    useEffect(() => {
        getApplicantDetails();
    }, []);


    const getApplicantDetails = async () => {
        api
            .get("/applicant/applicant/list/")
            .then((res) => res.data)
            .then((data) => {
                setApplicantDetails(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    return (
        <Authorisedroute>
            <div className="container">
                <h1 className="my-4">List of Applicants</h1>
                <div className="row">
                    {ApplicantDetails.map((details) => (
                        <div key={details.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{details.fullname}</h5>
                                    <p className="card-text">
                                        <strong>Email:</strong> {details.email}
                                    </p>
                                    <p className="card-text">
                                        <strong>Phone:</strong> 0{details.phonenumber}
                                    </p>
                                    <p className="card-text">
                                        <strong>Skills:</strong>
                                    </p>
                                    <ul>
                                        {<li>{details.skill_1}</li>}
                                        {<li>{details.skill_2}</li>}
                                        {<li>{details.skill_3}</li>}
                                        {<li>{details.skill_4}</li>}
                                        {<li>{details.skill_5}</li>}
                                    </ul>
                                    <p className="card-text">
                                        <strong>Qualifications:</strong> {details.qualifications}
                                    </p>
                                    <p className="card-text">
                                        <strong>Preferences:</strong> {details.preferences}
                                    </p>
                                    <p className="card-text">
                                        <strong>CV:</strong> {details.cv}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Authorisedroute>
    );
};

export default ListApplicants;
