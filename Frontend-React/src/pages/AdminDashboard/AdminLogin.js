import "../../styles/AdminLogin.css";
import logo from '../../styles/images/logo.png';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, Route, Routes } from 'react-router-dom';
import Home from "../../components/home";
import { toast } from "react-hot-toast"
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormGroup from "../../components/ui/FormGroup";
import PageContainer from "../../components/layout/PageContainer";

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        setErrorMsg("");
        const requestBody = { email: email, password: password };
        try {
            const response = await axios.post("http://localhost:8080/adminLogin", requestBody);
            const admin = response.data;
            sessionStorage.setItem("adminId", admin.id);
            navigate("/adminDashboard", { state: response?.data });
            toast.success("Successfully logged in");
        } catch (error) {
            setErrorMsg(error.response?.data?.errorMessage);
            toast.error("Failed to login");
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
                                
                                <h1 className="auth-form-title">Admin Login</h1>
                                
                                <Card>
                                    <form onSubmit={login}>
                                        <FormGroup label="Email" htmlFor="admin-email">
                                            <input
                                                id="admin-email"
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter your email"
                                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </FormGroup>
                                        
                                        <FormGroup label="Password" htmlFor="admin-password">
                                            <input
                                                id="admin-password"
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter your password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </FormGroup>
                                        
                                        <Button type="submit" variant="primary" fullWidth>
                                            Login
                                        </Button>
                                        
                                        {errorMsg && (
                                            <div className="text-danger mt-3">
                                                {errorMsg}
                                            </div>
                                        )}
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
            <Routes>
                <Route path='/home' element={<Home />} />
            </Routes>
        </PageContainer>
    );
}
export default AdminLogin;