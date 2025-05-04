import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = ({
  label,
  htmlFor,
  children,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`} {...props}>
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error && <div className="form-error text-danger">{error}</div>}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  className: PropTypes.string
};

export default FormGroup; 