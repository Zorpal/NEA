import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "./components/Header";
import ListofJobs from "./webpages/ListofJobs";
import JobDetails from "./webpages/JobDetails";
import HomePage from "./webpages/HomePage";
import { useEffect, useState, useCallback } from "react";
import ApplicantContext from "./context/ApplicantContext";
import Logout from "./webpages/Logout";
import NotFound from "./webpages/404NotFound";
import Login from "./webpages/Login";
import Register from "./webpages/Register";
import Footer from "./components/Footer";
import ApplicantDetails from "./webpages/ApplicantDetails";
import ApplicantProfile from "./webpages/ApplicantProfile";
import { ACCESS_TOKEN } from "./constants";
import EmployeeHome from "./webpages/EmployeeHome";
import ListApplicants from "./webpages/ListApplicants";
import AddJob from "./webpages/AddJob";

function App() {
  //takes in my google app's client id from the environment variable file
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const [userinformation, setuserinformation] = useState([]); //stores the accesstoken and username of the user

  const verifytoken = useCallback(() => {
    const access_key = localStorage.getItem(ACCESS_TOKEN);

    fetch("/applicant/token/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: access_key }),
    }).then((response) => {
      if (response.ok) {
        setuserinformation({
          access_token: access_key,
        });
      } else {
        setuserinformation({
          access_token: null,
        });
      }
    });
  }, []);

  useEffect(() => {
    verifytoken();
  }, [verifytoken]);

  const updateuserinformation = (value) => {
    setuserinformation(value);
  };

  return (
    //BrowserRouter allows for my pages to render without necessarily having to be refreshed every time new components are rendered
    <BrowserRouter> 
      <ApplicantContext.Provider value={{ userinformation, updateuserinformation }}>
          <GoogleOAuthProvider clientId={clientId}>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/Jobs/List/" exact element={<ListofJobs />}></Route>
                <Route path="/Jobs/List/:jobId/" element={<JobDetails />}></Route>
                <Route path="/" exact element={<HomePage />}></Route>
                <Route path="/logout/" element={<Logout />}></Route>
                <Route path="/login/" element={<Login />}></Route>
                <Route path="/register/" element={<Register />}></Route>
                <Route path="*" element={<NotFound />}></Route>
                <Route path="/applicant/details/" element={<ApplicantProfile />}></Route>
                <Route path="/applicant/details/update/" element={<ApplicantDetails />}></Route>
                <Route path="/employee/home/" element={<EmployeeHome />}></Route>
                <Route path="/applicant/list/" element={<ListApplicants />}></Route>
                <Route path="/Jobs/add/" element={<AddJob />}></Route>
              </Routes>
              <Footer />
            </div>
          </GoogleOAuthProvider>
      </ApplicantContext.Provider>
    </BrowserRouter>
  );
}

export default App;