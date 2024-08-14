import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const BreadcrumbItem = styled.span`
  cursor: pointer;

  &::after {
    content: ' > ';
    padding: 0 8px;
  }

  &:last-child::after {
    content: '';
  }

  &:last-child {
    color: #ff7a00;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const Breadcrumb = ({ breadcrumbs, onBreadcrumbClick }) => {
  const handleClick = breadcrumb => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick(breadcrumb);
    }
  };

  return (
    <BreadcrumbContainer>
      {breadcrumbs?.length > 1 &&
        breadcrumbs?.map((breadcrumb, index) => (
          <BreadcrumbItem key={index} onClick={() => handleClick(breadcrumb)}>
            {breadcrumb.name}
          </BreadcrumbItem>
        ))}
    </BreadcrumbContainer>
  );
};

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onBreadcrumbClick: PropTypes.func,
};

Breadcrumb.defaultProps = {
  breadcrumbs: [],
  onBreadcrumbClick: () => {},
};

export default Breadcrumb;
