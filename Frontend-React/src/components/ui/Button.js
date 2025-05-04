import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const getButtonClasses = () => {
    const variantClass = variant ? `btn-${variant}` : '';
    const sizeClass = size ? `btn-${size}` : '';
    const widthClass = fullWidth ? 'w-100' : '';
    
    return `btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim();
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'accent', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button; 