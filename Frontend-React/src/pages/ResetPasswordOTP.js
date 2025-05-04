import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PasswordInput } from '../components/PasswordInput';
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormGroup from "../components/ui/FormGroup";
import PageContainer from "../components/layout/PageContainer";

function ResetPasswordOTP() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const userEmail = sessionStorage.getItem("email");

    const resetPassword = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            axios.put("http://localhost:8080/user/otp/reset_password",
                { "password": password },
                {
                    params: {
                        email: userEmail,
                    }
                })
                .then(data => {
                    sessionStorage.clear();
                    toast.success("Password changed successfully");
                    setTimeout(() => {
                        navigate("/login");
                    }, 500);
                })
                .catch(error => {
                    console.error('Error:', error);
                    toast.error("Failed to reset password");
                });

        } else {
            toast.error("Passwords do not match");
        }
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
                                
                                <h1 className="auth-form-title">Reset Password</h1>
                                
                                <Card>
                                    <form onSubmit={resetPassword}>
                                        <FormGroup label="New Password" htmlFor="new-password">
                                            <PasswordInput
                                                id="new-password"
                                                className="form-control"
                                                placeholder="Enter your new password"
                                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                                required
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <small className="text-muted">
                                                Password must contain at least one digit, one lowercase letter,
                                                one uppercase letter, and be at least 8 characters long.
                                            </small>
                                        </FormGroup>
                                        
                                        <FormGroup label="Confirm Password" htmlFor="confirm-password">
                                            <PasswordInput
                                                id="confirm-password"
                                                className="form-control"
                                                placeholder="Confirm your new password"
                                                required
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </FormGroup>
                                        
                                        <Button type="submit" variant="primary" fullWidth>
                                            Reset Password
                                        </Button>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

export default ResetPasswordOTP;