import React from "react";

const HomePage = () => {
  const spacing = 18;
  return (
    <div className="card" style={{margin: spacing}}>

      <div className="card-body">
        <h5 className="card-title">About Us</h5>
        <p className="card-text">
        Templewood Recruitment Ltd are a leading independent recruitment consultancy, specialising in the supply of high calibre Temporary, Contract and Permanent staff within the Professional Services and Health & Social Care sectors.
        </p>
        <p className="card-text">
        Created and run by a senior management team, benefiting from over 50 years of recruitment expertise; our goal is to provide a world className and highly effective service to both our clients and candidates. Striving to ‘wow’ our customers in every interaction; our long term vision is to positively challenge the status quo within the recruitment industry and to firmly establish Templewood Recruitment as a trusted business partner and the definitive agency of choice for our service users.
        </p>
        <a className="btn btn-primary" href="https://www.templewoodrecruitment.co.uk" target="_blank" rel="noopener noreferrer">
          Our Website
        </a>
      </div>
    </div>
  );
};

export default HomePage;
