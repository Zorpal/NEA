import React from "react";

const HomePage = () => {
  const spacing = 18;
  return (
    <div className="container" style={{marginTop: spacing}}>
      <div className="card mb-3" style={{margin: spacing}}>
        <div className="card-body">
          <h5 className="card-title">About Us</h5>
          <p className="card-text">
            Templewood Recruitment Ltd are a leading independent recruitment consultancy, specialising in the supply of high calibre Temporary, Contract and Permanent staff within the Professional Services and Health & Social Care sectors.
          </p>
          <p className="card-text">
            Created and run by a senior management team, benefiting from over 50 years of recruitment expertise; our goal is to provide a world class and highly effective service to both our clients and candidates. Striving to ‘wow’ our customers in every interaction; our long term vision is to positively challenge the status quo within the recruitment industry and to firmly establish Templewood Recruitment as a trusted business partner and the definitive agency of choice for our service users.
          </p>
          <a className="btn btn-primary" href="https://www.templewoodrecruitment.co.uk" target="_blank" rel="noopener noreferrer">
            Our Website
          </a>
        </div>
      </div>

      <div className="card" style={{margin: spacing}}>
        <div className="card-body">
          <h5 className="card-title">Features and Purpose</h5>
          <p className="card-text">
            Welcome to our recruitment platform! This website is built with various features designed to help you navigate and utilize our services effectively.
          </p>
          <p className="card-text">
            <strong>Home:</strong> Click on the <strong>Home</strong> button to return to the main page.
          </p>
          <p className="card-text">
            <strong>Jobs:</strong> Click on the <strong>Jobs</strong> button to browse through the available job listings. You can filter jobs based on the employment type i.e. full-time, part-time, seasonal, internship, temporary and contract.
          </p>
          <p className="card-text">
            <strong>Profile:</strong> Click on the Profile button to view the stage you are at within the recruitment process, edit your personal information. Here you may submit your details along with a CV and we will help you along the way!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
