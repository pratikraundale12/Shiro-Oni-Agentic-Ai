import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { history } from '../helpers/history';
import { GridSelectors, NamespacesActions } from '../store';

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  flex-wrap: wrap;
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

const MODULES = [
  'namespaces',
  'destNamespaces',
  'deploy',
  'upgrade',
  'ldap',
  'path',
];
const Breadcrumb = ({ module, path, onClick, fromDetailPage = false }) => {
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, module)
  );
  const data = isEmpty(path) ? breadcrumbs : path;
  const handleClick = value => {
    if (value?.callback) {
      value.callback();
    }
    if (module === 'namespaces') {
      dispatch(NamespacesActions.setSelectedNamespace(value));
      dispatch(NamespacesActions.setSelectedNameSpaceForDetail(value));
      if (fromDetailPage) {
        history.push(`/process-group`);
      }
    } else if (module === 'destNamespaces')
      dispatch(NamespacesActions.setSelectedDestNamespace(value));
    else if (onClick && module === 'ldap') onClick(value.label);
    else history.push(value.path);
  };

  if (!MODULES.includes(module)) return null;
  if (data.length <= 1) return null;

  return (
    <BreadcrumbContainer id={module}>
      {data?.map((breadcrumb, index) => (
        <BreadcrumbItem
          key={index}
          id={module + breadcrumb?.label}
          onClick={() => handleClick(breadcrumb)}
        >
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
  fromDetailPage: PropTypes.bool,
};

export default Breadcrumb;
