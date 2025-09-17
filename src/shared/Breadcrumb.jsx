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
  display: flex;
  align-items: center;

  span {
    &:hover {
      text-decoration: underline;
    }
  }

  &:last-child span {
    color: #ff7a00;
  }
`;

const BreadcrumbSeparator = styled.span`
  padding: 0 8px;
  user-select: none;
  pointer-events: none;
  text-decoration: none;
`;

const MODULES = [
  'namespaces',
  'destNamespaces',
  'deploy',
  'upgrade',
  'ldap',
  'path',
  'role_permission',
];
const Breadcrumb = ({
  module,
  path,
  onClick,
  fromDetailPage = false,
  setRemoveSearch = () => {},
  activeSidebarItem = {},
}) => {
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
      setRemoveSearch(true);

      dispatch(NamespacesActions.setSelectedNamespace(value));
      dispatch(NamespacesActions.setSelectedNameSpaceForDetail(value));
      if (fromDetailPage) {
        history.push(`/process-group`);
      }
    } else if (module === 'destNamespaces') {
      dispatch(NamespacesActions.setSelectedDestNamespace(value));
    } else if (onClick && module === 'ldap') onClick(value.label);
    else if (module === 'role_permission') {
      dispatch(
        NamespacesActions.setSelectedNamespace({
          label: activeSidebarItem?.name || value?.label,
          value: activeSidebarItem?.id || value?.value,
        })
      );
      dispatch(NamespacesActions.fetchNamespaces());
    } else history.push(value.path);
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
          <span>{breadcrumb.label}</span>
          {index !== data.length - 1 && (
            <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          )}
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
  setRemoveSearch: PropTypes.func,
  activeSidebarItem: PropTypes.object,
};

export default Breadcrumb;
