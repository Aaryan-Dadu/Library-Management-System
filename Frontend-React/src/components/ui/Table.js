import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  data,
  striped = true,
  hover = true,
  className = '',
  emptyMessage = 'No data available',
  ...props
}) => {
  const tableClasses = [
    'table',
    striped ? 'table-striped' : '',
    hover ? 'table-hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="table-responsive">
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={column.style}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} style={column.cellStyle}>
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string,
      cell: PropTypes.func,
      style: PropTypes.object,
      cellStyle: PropTypes.object
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  className: PropTypes.string,
  emptyMessage: PropTypes.node
};

export default Table; 