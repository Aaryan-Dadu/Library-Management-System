import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageContainer from '../components/layout/PageContainer';

export default function Error() {
  return (
    <PageContainer>
      <div className="container">
        <div className="row justify-content-center text-center py-5">
          <div className="col-md-8">
            <div className="error-page">
              <div className="error-icon mb-4">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9945 16H12.0035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="mb-4">404 - Page Not Found</h1>
              <p className="mb-5">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
              <Link to="/">
                <Button variant="primary">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
