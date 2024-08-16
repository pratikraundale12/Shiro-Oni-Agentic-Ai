import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { GridSelectors, NamespacesActions } from '../store';
import { history } from '../helpers/history';

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const BreadcrumbItem = styled.span`
  cursor: pointer;

  &::after {
    content: '>';
    padding: 0 8px;
    text-decoration: none;
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

const MODULES = ['namespaces', 'destNamespaces', 'deploy', 'upgrade', 'ldap'];
const Breadcrumb = ({ module, path, onClick }) => {
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, module)
  );
  const data = isEmpty(path) ? breadcrumbs : path;

  const handleClick = value => {
    console.log(value);
    if (module === 'namespaces')
      dispatch(NamespacesActions.setSelectedNamespace(value));
    else if (module === 'destNamespaces')
      dispatch(NamespacesActions.setSelectedDestNamespace(value));
    else if (onClick && module === 'ldap') onClick(value.label);
    else history.push(value.path);
  };

  if (!MODULES.includes(module)) return null;
  if (data.length <= 1) return null;

  return (
    <BreadcrumbContainer>
      {data?.map((breadcrumb, index) => (
        <BreadcrumbItem key={index} onClick={() => handleClick(breadcrumb)}>
          {breadcrumb.label}
        </BreadcrumbItem>
      ))}
    </BreadcrumbContainer>
  );
};

Breadcrumb.propTypes = {
  module: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.shape({})),
  onClick: PropTypes.func,
};

export default Breadcrumb;
