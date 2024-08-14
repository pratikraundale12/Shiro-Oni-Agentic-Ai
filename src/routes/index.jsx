import React from 'react';
import { Outlet, Route, Routes as Router } from 'react-router-dom';
import AuthGaurd from './AuthGuard';

import {
  NotFound,
  Login,
  Forgot,
  Reset,
  Success,
  Dashboard,
  ListUsers,
  ListClusters,
  ListNamespaces,
  ReadyFlowGallary,
  GenrateFlow,
  PermissionMatrix,
  Add,
  UserLogin,
  ActvityHistory,
} from '../pages';
import {
  ActivityHistoryIcon,
  ClusterIcon,
  DashboardIcon,
  GenrateFlowIcon,
  LockIcon,
  NameSpaceIcon,
  PeopleIcon,
  ReadyFlowIcon,
} from '../assets';
import { ClusterSummary } from '../pages/Clusters/ClusterSummary';
import Deploy from '../pages/Namespaces/Deploy';
import Upgrade from '../pages/Namespaces/Upgrade';
import Summary from '../pages/Namespaces/Summary';

export const ROUTES_MENU = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    icon: DashboardIcon,
    pages: [
      {
        path: '/dashboard',
        component: <Dashboard />,
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
        path: ['add', 'edit'],
        component: <Add />,
      },
      {
        path: ['summary'],
        component: <ClusterSummary />,
      },
    ],
  },
  {
    name: 'Namespace',
    path: 'namespaces',
    icon: NameSpaceIcon,
    pages: [
      {
        path: '',
        component: <ListNamespaces />,
      },
      {
        path: 'deploy',
        component: <Deploy />,
      },
      {
        path: 'upgrade',
        component: <Upgrade />,
      },
      {
        path: 'summary',
        component: <Summary />,
      },
    ],
  },
  {
    name: 'Ready to use Flows',
    path: 'ready-flow-gallary',
    icon: ReadyFlowIcon,
    pages: [
      {
        path: '',
        component: <ReadyFlowGallary />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <div>ReadyFlow Gallary</div>,
      },
    ],
  },
  {
    name: 'Generate Flow',
    path: 'generate-flow',
    icon: GenrateFlowIcon,
    pages: [
      {
        path: '',
        component: <GenrateFlow />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <div>Genrate Flow</div>,
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
        component: <div>Permission</div>,
      },
    ],
  },
  {
    name: 'Activity History',
    path: 'activity-history',
    icon: ActivityHistoryIcon,
    pages: [
      {
        path: '',
        component: <ActvityHistory />,
      },
      {
        path: ['add', 'edit/:id'],
        component: <div>Activity History</div>,
      },
    ],
  },
];

const Routes = () => {
  return (
    <Router>
      {/* Public Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login" element={<UserLogin />} />

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
