import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to the Library Management System</h1>
            <p className="hero-description">
              A modern platform for book lovers, students, and researchers to discover, borrow, and manage library resources with ease.
            </p>
            <div className="hero-buttons">
              <Link to="/login/user">
                <Button variant="primary" size="lg">
                  Login as User
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="lg">
                  Login as Admin
                </Button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <svg width="400" height="400" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="300" cy="300" r="300" fill="#F0F2F5"/>
              <path d="M450 190C450 168.7 443.7 147.9 431.8 130.5C419.9 113.1 402.9 100 383.2 93.2C363.5 86.4 342.1 86.2 322.3 92.7C302.5 99.2 285.3 112 273.2 129.2C261.6 111.3 243.9 97.9 223.6 91C203.3 84.1 181.4 84.1 161.1 91C140.8 97.9 123.1 111.3 111.5 129.2C99.9 147.1 94.9 168.5 97.4 189.7C99.9 210.9 109.8 230.6 125.7 245.4C141.5 260.2 162 269.1 183.4 270.7C204.8 272.3 226.1 266.4 243.2 254C260.3 266.4 281.6 272.3 303 270.7C324.4 269.1 344.9 260.2 360.7 245.4C376.6 230.6 386.5 210.9 389 189.7C391.5 168.5 386.5 147.1 374.9 129.2L450 190Z" fill="#3A6EA5"/>
              <path d="M167 333L167 456C167 462.6 172.4 468 179 468L422 468C428.6 468 434 462.6 434 456L434 333" stroke="#212529" strokeWidth="10" strokeLinecap="round"/>
              <path d="M186 351L186 448L415 448L415 351" stroke="#212529" strokeWidth="6" strokeLinecap="round"/>
              <path d="M150 333H450" stroke="#212529" strokeWidth="10" strokeLinecap="round"/>
              <path d="M190 300H410C415.5 300 420 304.5 420 310V330H180V310C180 304.5 184.5 300 190 300Z" fill="#FF6B6B"/>
              <path d="M231 391H370" stroke="#3A6EA5" strokeWidth="6" strokeLinecap="round"/>
              <path d="M231 416H300" stroke="#3A6EA5" strokeWidth="6" strokeLinecap="round"/>
              <circle cx="300" cy="190" r="40" fill="#FF6B6B"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 