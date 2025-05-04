import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';
import { homeOutline, personOutline, notificationsOutline, logOutOutline } from "ionicons/icons";

function DashboardNav() {
    const location = useLocation();
    const [userName, setUserName] = useState("");
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        // Get user details
        if (userId) {
            axios.get('http://localhost:8080/users/' + userId)
                .then(response => {
                    setUserName(response.data.name);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [userId]);

    // Create sidebar items array for the DashboardLayout
    const sidebarItems = [
        {
            path: "/dashboard",
            label: "Home",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17.99V14.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            path: "/dashboard/myborrowedbooks",
            label: "My Borrowed Books",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.7399V4.66994C22 3.46994 21.02 2.57994 19.83 2.67994H19.77C17.67 2.85994 14.48 3.92994 12.7 5.04994L12.53 5.15994C12.24 5.33994 11.76 5.33994 11.47 5.15994L11.22 5.00994C9.44 3.89994 6.26 2.83994 4.16 2.66994C2.97 2.56994 2 3.46994 2 4.65994V16.7399C2 17.6999 2.78 18.5999 3.74 18.7199L4.03 18.7599C6.2 19.0499 9.55 20.1499 11.47 21.1999L11.51 21.2199C11.78 21.3699 12.21 21.3699 12.47 21.2199C14.39 20.1599 17.75 19.0499 19.93 18.7599L20.26 18.7199C21.22 18.5999 22 17.6999 22 16.7399Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5.48999V20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            path: "/dashboard/myaccount",
            label: "My Account",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        }
    ];

    const handleLogout = () => {
        // Navigate to logout page
        window.location.href = "/dashboard/userlogout";
    };

    // Placeholder avatar - you might want to replace with a real user avatar
    const userAvatar = "https://via.placeholder.com/40";

    // Extract the current page title from URL
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/dashboard") return "Dashboard";
        if (path === "/dashboard/myborrowedbooks") return "My Borrowed Books";
        if (path === "/dashboard/myaccount") return "My Account";
        return "Dashboard";
    };

    return (
        <DashboardLayout
            title={getPageTitle()}
            username={userName || "User"}
            avatar={userAvatar}
            sidebarItems={sidebarItems}
            onLogout={handleLogout}
        >
            <Outlet />
        </DashboardLayout>
    );
}

export default DashboardNav;