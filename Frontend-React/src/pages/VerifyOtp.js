import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormGroup from "../components/ui/FormGroup";
import PageContainer from "../components/layout/PageContainer";

function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const otpConfirmation = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/users/verify_otp", null, {
            params: {
                otp: otp,
            },
        })
            .then(data => {
                toast.success("OTP verified successfully");
                navigate("/reset_password_otp");
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error("Invalid OTP code");
            });
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
                                
                                <h1 className="auth-form-title">Verify OTP</h1>
                                
                                <Card>
                                    <p className="text-center mb-4">Please enter the OTP sent to your email</p>
                                    <form onSubmit={otpConfirmation}>
                                        <FormGroup label="OTP Code" htmlFor="otp-input">
                                            <input 
                                                id="otp-input"
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Enter your OTP code" 
                                                required
                                                onChange={(e) => setOtp(e.target.value)} 
                                            />
                                        </FormGroup>
                                        
                                        <Button type="submit" variant="primary" fullWidth>
                                            Verify OTP
                                        </Button>
                                    </form>
                                </Card>
                                
                                <div className="text-center mt-3">
                                    <Button 
                                        variant="link" 
                                        onClick={() => navigate("/forgotpassword")}
                                    >
                                        ← Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

export default VerifyOtp;