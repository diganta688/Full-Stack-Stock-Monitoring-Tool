import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";
import { uidContext } from "../Content/context";
import axios from "axios";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const { id } = useParams();
  const [display, setDisplay] = useState(false);
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(
        `https://full-stack-stock-monitoring-tool-backend-fjip.onrender.com/dashboard/${id}`,
        { withCredentials: true }
      );

    } catch (error) {
      console.error("Session expired:", error);
      window.location.href = "https://full-stack-stock-monitoring-tool-frontend.vercel.app/signup";
    }
  };

  useEffect(() => {
    fetchUserData();
    setDisplay(true);
  }, []);

  return (
    <uidContext.Provider value={{ uId: id }}>
      {display && <Alert severity="warning" >
      Here, you can analyze a stock. Buying and selling are dynamic as of now. All transactions—buying and selling—should function like real ones. However, the money you are using is not real.
      </Alert>}
      <div className="container-fluid p-0">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={5}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Flip}
        />
        <TopBar />
        <Dashboard />
      </div>
    </uidContext.Provider>
  );
}

export default Home;
