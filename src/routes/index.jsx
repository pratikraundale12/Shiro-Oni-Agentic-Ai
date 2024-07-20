import React from 'react';
import { Outlet, Route, Routes as Router } from 'react-router-dom';
import AuthGaurd from './AuthGuard';

import {
  NotFound,
  Login,
  Forgot,
  Reset,
  Success,
  ListDashBoard,
  ListUsers,
  AddUser,
  ListClusters,
  AddCluster,
  ListNamespaces,
  ReadyFlowGallary,
  GenrateFlow,
  PermissionMatrix,
} from '../pages';
import {
  ClusterIcon,
  DashboardIcon,
  GenrateFlowIcon,
  LockIcon,
  NameSpaceIcon,
  PeopleIcon,
  ReadyFlowIcon,
} from '../assets';

export const ROUTES_MENU = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    icon: DashboardIcon,
    pages: [
      {
        path: '',
        component: <ListDashBoard />,
      },
    ],
  },
  {
    name: 'Cluster',
    path: 'cluster',
    icon: ClusterIcon,
    pages: [
      {
        path: '',
        component: <ListClusters />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <AddCluster />,
      },
    ],
  },
  {
    name: 'Namespace',
    path: 'namespace',
    icon: NameSpaceIcon,
    pages: [
      {
        path: '',
        component: <ListNamespaces />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <AddCluster />,
      },
    ],
  },
  {
    name: 'ReadyFlow Gallary',
    path: 'ready-flow-gallary',
    icon: ReadyFlowIcon,
    pages: [
      {
        path: '',
        component: <ReadyFlowGallary />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <AddCluster />,
      },
    ],
  },
  {
    name: 'Genrate Flow',
    path: 'genrate-flow',
    icon: GenrateFlowIcon,
    pages: [
      {
        path: '',
        component: <GenrateFlow />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <AddCluster />,
      },
    ],
  },
  {
    name: 'User Management',
    path: 'user-management',
    icon: PeopleIcon,
    pages: [
      {
        path: '',
        component: <ListUsers />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <AddUser />,
      },
    ],
  },

  {
    name: 'Permission Matrix',
    path: 'permission-matrix',
    icon: LockIcon,
    pages: [
      {
        path: '',
        component: <PermissionMatrix />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <AddCluster />,
      },
    ],
  },
];

const Routes = () => {
  return (
    <Router>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/success" element={<Success />} />

      {/* Private Routes */}
      <Route path="/" element={<AuthGaurd />}>
        {ROUTES_MENU.map(item => (
          <Route key={item.path} path={item.path} element={<Outlet />}>
            {item.pages.map(page =>
              Array.isArray(page.path) ? (
                page.path.map(subPath => (
                  <Route
                    key={subPath}
                    path={subPath}
                    element={page.component}
                  />
                ))
              ) : (
                <Route
                  key={page.path}
                  path={page.path}
                  index={!!page.path}
                  element={page.component}
                />
              )
            )}
          </Route>
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Router>
  );
};

export default Routes;
