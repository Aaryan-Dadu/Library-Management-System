import React from 'react';
import PropTypes from 'prop-types';

const PageContainer = ({ 
  children, 
  title, 
  subtitle, 
  actions,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div className={`page-container ${className}`}>
      {(title || subtitle || actions) && (
        <header className="page-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
              {actions && <div className="page-actions">{actions}</div>}
            </div>
          </div>
        </header>
      )}
      <main className="page-content">
        <div className={fullWidth ? '' : 'container'}>
          {children}
        </div>
      </main>
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  fullWidth: PropTypes.bool,
  className: PropTypes.string
};

export default PageContainer; 