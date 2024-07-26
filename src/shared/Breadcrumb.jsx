import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const BreadcrumbItem = styled.span`
  &::after {
    content: ' > ';
    padding: 0 8px;
  }

  &:last-child::after {
    content: '';
  }
`;

const Breadcrumb = ({ breadcrumbs }) => {
  return (
    <BreadcrumbContainer>
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem key={index}>{breadcrumb.name}</BreadcrumbItem>
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
};

export default Breadcrumb;
