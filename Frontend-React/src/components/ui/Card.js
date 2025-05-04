import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  title, 
  footer,
  className = '', 
  bodyClassName = '',
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header">
          {typeof title === 'string' ? <h3>{title}</h3> : title}
        </div>
      )}
      
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  footer: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string
};

export default Card; 