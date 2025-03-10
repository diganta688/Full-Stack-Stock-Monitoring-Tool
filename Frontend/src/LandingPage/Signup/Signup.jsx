import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [errorOtp, setErrorOtp] = useState("");
  const [isContinue, setIsContinue] = useState(false);
  const [otpSent, setOtpSend] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 10) {
      setError("Mobile number cannot exceed 10 digits.");
      setIsContinue(false);
    } else if (!/^[6-9]/.test(value) && value.length === 1) {
      setError("Mobile number must start with 6, 7, 8, or 9.");
      setIsContinue(false);
    } else if (value.length === 10 && !error) {
      setIsContinue(true);
    } else {
      setError("");
      setIsContinue(false);
    }
    setMobile(value);
  };

  const handleSubmit = async (e) => {
    setIsContinue(false);
    setOtpSend(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup/mobile`,
        {
          phoneNumber: "+91" + mobile,
        }
      );
      setOtpSend(false);
      let { generateOTP, success } = response.data;
      if (response.data.redirectTo && success) {
        setIsContinue(true);
        navigate(response.data.redirectTo, {
          state: { mobile, generateOTP, success },
        });
      } else {
        setIsContinue(true);
        setError("Unexpected response from server");
      }
    } catch (err) {
      setIsContinue(true);
      setError("Error occurred while signing up. Please try again.");
      setErrorOtp(
        "Otp can be recive only few numbers. If you facing some issue then"
      );
      setOtpSend(false);
    }
  };
  const mobileVerification = async () => {
    setOtpSend(true); 
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mobile-verification`,
        { phoneNumber: mobile }
      );
      if (response.data.redirectTo) {
        navigate(response.data.redirectTo, {
          state: { mobile, SuccessMessage: true },
        });
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      setError("Error occurred while signing up. Please try again.");
    } finally {
      setOtpSend(false);
    }
  };

  return (
    <div className="container ">
      <div className="row p-5">
        <div className="col-8 signup-col" style={{margin: "0 auto"}}>
          <img
            src="media/Images/signup.png"
            alt="Signup Illustration"
            className="signup-image"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col d-flex flex-column justify-content-center" style={{minWidth: "264px"}}>
          <form onSubmit={handleSubmit}>
            <div className="mb-2 px-2">
              <h2>Verify Phone Number</h2>
            </div>
            <div className="text-muted px-2">
              <p>Or track your existing application.</p>
            </div>
            <div className="mb-3">
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-Mobile">
                  Mobile
                </InputLabel>
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-Mobile"
                  value={mobile}
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">+91</InputAdornment>
                  }
                  label="Mobile"
                />
              </FormControl>
              {error && (
                <div>
                  <p className="text-danger small">{error}</p>
                </div>
              )}
            </div>
            <div className="text-muted px-2">
              {errorOtp ? (
                <p className="text-danger small">
                  {errorOtp}&nbsp;
                  {otpSent ? (
                    <span style={{ color: "#0d6efd" }}>Loading...</span> 
                  ) : (
                    <a
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={mobileVerification}
                    >
                      Login Here
                    </a>
                  )}
                </p>
              ) : (
                <p>You will receive an OTP on your number</p>
              )}
            </div>
            <div className="px-2 mb-2">
              {otpSent ? (
                <button type="submit" className="btn btn-primary" disabled>
                  Loading...
                </button>
              ) : isContinue ? (
                <button type="submit" className="btn btn-primary">
                  Continue
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled>
                  Continue
                </button>
              )}
            </div>
            <div className="px-2" style={{ fontSize: "12px" }}>
              <a href="/">
                <p>Want to open an NRI account?</p>
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="row text-center">
        <p className="disclaimer">
          I authorise StockWISE to contact me even if my number is registered
          on DND. I authorise StockWISE to fetch my KYC information from the
          C-KYC registry with my PAN. Please visit <a href="/">this article</a>{" "}
          to know more. By submitting your contact details, you authorize
          StockWISE to contact you even if you are registered on DND & conduct
          online KYC for trading & demat account opening as per KRA regulations
          and PMLA guidelines. If you are looking to open a HUF, Corporate,
          Partnership, or NRI account, you have to use the{" "}
          <a href="/">offline forms</a>. For help, <a href="/">click here</a>.
        </p>
      </div>
    </div>
  );
}

export default Signup;
