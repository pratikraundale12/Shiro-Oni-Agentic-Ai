import React, { useEffect } from 'react';
import { Outlet, Route } from 'react-router-dom';

import AuthGaurd from './AuthGuard';
import { HistoryRouter } from './HistoryRouter';

import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityHistoryIcon,
  ClusterIcon,
  DashboardIcon,
  GenrateFlowIcon,
  LdapConfigIcon,
  LockIcon,
  NameSpaceIcon,
  PeopleIcon,
  ReadyFlowIcon,
} from '../assets';
import { FullPageLoader } from '../components';
import {
  ActvityHistory,
  Add,
  Dashboard,
  Forgot,
  GenrateFlow,
  LdapConfig,
  ListClusters,
  ListNamespaces,
  ListUsers,
  Login,
  NotFound,
  PermissionMatrix,
  ReadyFlowGallary,
  Reset,
  SessionExpired,
  Success,
  UserLogin,
} from '../pages';
import { ClusterSummary } from '../pages/Clusters/ClusterSummary';
import Deploy from '../pages/Namespaces/Deploy';
import Summary from '../pages/Namespaces/Summary';
import Upgrade from '../pages/Namespaces/Upgrade';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../store';

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
    path: 'clusters',
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
        path: [':id'],
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
    hidden: true,
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
    hidden: true,
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
    name: 'Role & Permission',
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
    name: 'LDAP Configuration',
    path: 'ldap-configuration',
    icon: LdapConfigIcon,
    pages: [
      {
        path: '',
        component: <LdapConfig />,
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
    hidden: true,
  },
];

const Routes = () => {
  const dispatch = useDispatch();
  const isLicenseValid = useSelector(AuthenticationSelectors.getIsLicenseValid);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchLicenseInfo')
  );

  useEffect(() => {
    dispatch(AuthenticationActions.fetchLicenseInfo());
  }, [dispatch]);

  if (!isLicenseValid) return <SessionExpired />;

  if (loading) return <FullPageLoader loading={loading} />;

  return (
    <HistoryRouter>
      {/* Public Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login" element={<UserLogin />} />

      {/* Private Routes */}
      <Route path="/" element={<AuthGaurd />}>
        {ROUTES_MENU.filter(item => !item.hidden).map(item => (
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
    </HistoryRouter>
  );
};

export default Routes;
