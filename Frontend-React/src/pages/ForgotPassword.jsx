import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormGroup from "../components/ui/FormGroup";
import PageContainer from "../components/layout/PageContainer";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const confirmEmail = () => {
    axios
      .post("http://localhost:8080/users/send_otp", {
        email: email,
      })
      .then((data) => {
        // handle the response from the server
        sessionStorage.setItem('email', email);
        toast.success("OTP code sent");
        navigate("/verify_otp");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Verification error");
      });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault()
    confirmEmail()
  }
  
  return (
    <PageContainer fullWidth>
      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="auth-form-container">
                <div className="auth-form-logo">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.5 2V9.5C15.5 10.33 14.5 10.75 13.9 10.15L12.5 8.75C12.22 8.47 11.78 8.47 11.5 8.75L10.1 10.15C9.5 10.75 8.5 10.33 8.5 9.5V2H15.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.5 14H17.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.5 18H17.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14H9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 18H9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <h1 className="auth-form-title">Forgot Password</h1>
                
                <Card>
                  <form onSubmit={handleSubmit}>
                    <FormGroup label="Email" htmlFor="forgot-email">
                      <input
                        id="forgot-email"
                        type="email"
                        className="form-control"
                        placeholder="Enter your registered email"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Please enter a valid email address")
                        }
                        onInput={(e) => e.target.setCustomValidity("")}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </FormGroup>
                    
                    <Button type="submit" variant="primary" fullWidth>
                      Send OTP Code
                    </Button>
                  </form>
                </Card>
                
                <div className="text-center mt-3">
                  <Link to="/" className="text-primary">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default ForgotPassword;