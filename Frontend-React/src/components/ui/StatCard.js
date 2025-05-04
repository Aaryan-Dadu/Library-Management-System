import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({
  icon,
  value,
  label,
  color = 'primary',
  className = '',
  ...props
}) => {
  const colorClasses = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    warning: 'var(--warning)',
    accent: 'var(--accent)'
  };

  const cardStyle = {
    borderLeft: `4px solid ${colorClasses[color] || colorClasses.primary}`
  };

  const iconStyle = {
    backgroundColor: `${colorClasses[color] || colorClasses.primary}10`,
    color: colorClasses[color] || colorClasses.primary
  };

  return (
    <div className={`stat-card ${className}`} style={cardStyle} {...props}>
      <div className="stat-card-content">
        <h2 className="stat-card-value">{value}</h2>
        <p className="stat-card-label">{label}</p>
      </div>
      {icon && (
        <div className="stat-card-icon" style={iconStyle}>
          {icon}
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'accent']),
  className: PropTypes.string
};

export default StatCard; 