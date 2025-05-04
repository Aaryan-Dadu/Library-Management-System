import "../../styles/login.css";
import logo from "../../styles/images/logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../ForgotPassword";
import { Link, Route, Routes } from "react-router-dom";
import Home from "../../components/home";
import { toast } from "react-hot-toast"
import { PasswordInput } from "../../components/PasswordInput";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormGroup from "../../components/ui/FormGroup";
import PageContainer from "../../components/layout/PageContainer";

function Login() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [logEmail, setlogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Log in
  const login = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    const requestBody = { email: logEmail, password: logPassword };
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        requestBody
      );
      const user = response.data;
      if (rememberMe) {
        // Store the user ID and "Remember me" flag in the local storage if "Remember me" is checked
        localStorage.setItem('userId', user.id);
        localStorage.setItem('isRememberMe', true);
      } else {
        // Otherwise, store the user ID in the session storage and clear the "Remember me" flag from the local storage
        localStorage.setItem('userId', user.id);
        localStorage.setItem('isRememberMe', false);
      }
      sessionStorage.setItem("userId", user.id); // Store the user ID in the session storage
      navigate("/dashboard", { state: user });
      toast.success("Successfully Sign In")
    } catch (error) {
      setErrorMsg(error.response?.data?.errorMessage);
      toast.error("Failed to Sign In")
    }
  };

  // sign up
  const register = async (event) => {
    event.preventDefault();
    
    // Check if any of the input values are empty
    if (!name || !phoneNumber || !regEmail || !regPassword || !confirmPassword) {
      toast.error("Fill all the fields");
      return;
    }

    // Validate password using regex pattern
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(regPassword)) {
      toast.error("Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long");
      return;
    }

    if (regPassword !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    var requestBody = {
      name: name,
      phoneNumber: phoneNumber,
      email: regEmail,
      password: regPassword,
    };
    try {
      const response = await axios.post("http://localhost:8080/register", requestBody);
      toast.success("Successfully Signed up");
      setName("");
      setPhoneNumber("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
      setIsRegistering(false); // Switch back to login form after successful registration
    } catch (error) {
      console.error(error);
      toast.error("Failed to Signup");
    }
  };

  // remember me 
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

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
                
                <h1 className="auth-form-title">
                  {isRegistering ? "Create Account" : "Welcome Back"}
                </h1>
                
                <Card>
                  {!isRegistering ? (
                    <form onSubmit={login}>
                      <FormGroup label="Email" htmlFor="login-email">
                        <input
                          id="login-email"
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          required
                          value={logEmail}
                          onChange={(e) => setlogEmail(e.target.value)}
                        />
                      </FormGroup>
                      
                      <FormGroup label="Password" htmlFor="login-password">
                        <input
                          id="login-password"
                          type="password"
                          className="form-control"
                          placeholder="Enter your password"
                          required
                          value={logPassword}
                          onChange={(e) => setLogPassword(e.target.value)}
                        />
                      </FormGroup>
                      
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="remember-me"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                          />
                          <label className="form-check-label" htmlFor="remember-me">
                            Remember me
                          </label>
                        </div>
                        <Link to="/forgotpassword" className="text-primary">
                          Forgot Password?
                        </Link>
                      </div>
                      
                      <Button type="submit" variant="primary" fullWidth>
                        Sign In
                      </Button>
                      
                      {errorMsg && (
                        <div className="text-danger mt-3">
                          {errorMsg}
                        </div>
                      )}
                    </form>
                  ) : (
                    <form onSubmit={register}>
                      <FormGroup label="Full Name" htmlFor="reg-name">
                        <input
                          id="reg-name"
                          type="text"
                          className="form-control"
                          placeholder="Enter your full name"
                          pattern="^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormGroup>
                      
                      <FormGroup label="Phone Number" htmlFor="reg-phone">
                        <input
                          id="reg-phone"
                          type="tel"
                          className="form-control"
                          placeholder="Enter your phone number"
                          pattern="[0-9]{10}"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </FormGroup>
                      
                      <FormGroup label="Email" htmlFor="reg-email">
                        <input
                          id="reg-email"
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                        />
                      </FormGroup>
                      
                      <FormGroup label="Password" htmlFor="reg-password">
                        <PasswordInput
                          id="reg-password"
                          className="form-control"
                          placeholder="Create a password"
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                        />
                        <small className="text-muted">
                          Password must contain at least one digit, one lowercase letter,
                          one uppercase letter, and be at least 8 characters long.
                        </small>
                      </FormGroup>
                      
                      <FormGroup label="Confirm Password" htmlFor="reg-confirm-password">
                        <PasswordInput
                          id="reg-confirm-password"
                          className="form-control"
                          placeholder="Confirm your password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </FormGroup>
                      
                      <Button type="submit" variant="primary" fullWidth>
                        Sign Up
                      </Button>
                    </form>
                  )}
                </Card>
                
                <div className="text-center mt-4">
                  {isRegistering ? (
                    <p>
                      Already have an account?{" "}
                      <Button 
                        variant="link" 
                        onClick={() => setIsRegistering(false)}
                      >
                        Sign In
                      </Button>
                    </p>
                  ) : (
                    <p>
                      Don't have an account?{" "}
                      <Button 
                        variant="link" 
                        onClick={() => setIsRegistering(true)}
                      >
                        Sign Up
                      </Button>
                    </p>
                  )}
                </div>
                
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
      <Routes>
        <Route path="/forgotpassowrd" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </PageContainer>
  );
}
export default Login;
