/*eslint-disable*/
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
  ScheduleDeploymentIcon,
  SettingSmallIcon,
} from '../assets';
import { FullPageLoader } from '../components';
import {
  ActvityHistory,
  Add,
  ClusterAccess,
  Dashboard,
  Forgot,
  GenrateFlow,
  LdapConfig,
  ListClusters,
  ListNamespaces,
  ListUsers,
  Login,
  ModuleAccess,
  NotFound,
  ReadyFlowGallary,
  Reset,
  SessionExpired,
  Setting,
  Success,
  UserLogin,
} from '../pages';
import { ClusterSummary } from '../pages/Clusters/ClusterSummary';
import Deploy from '../pages/Namespaces/Deploy';
import Summary from '../pages/Namespaces/Summary';
import { ListScheduleDeployment } from '../pages/ScheduleDeployment';
import Upgrade from '../pages/Namespaces/Upgrade';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../store';
import { SettingsActions, SettingsSelectors } from '../store/settings';
import UnAuthGuard, { UNAUTHROUTES_MENU } from './UnAuthGuard';

export const ROUTES_MENU = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    icon: DashboardIcon,
    pages: [
      {
        path: '',
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
    permission: 'view_cluster',
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
    permission: 'view_namespace',
  },
  {
    name: 'Schedule Deployment',
    path: 'schedule-deployment',
    icon: ScheduleDeploymentIcon,
    pages: [
      {
        path: '',
        component: <ListScheduleDeployment />,
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
    permission: 'view_namespace',
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
    permission: 'view_user',
  },
  {
    name: 'Role & Permission',
    path: 'role-&-permission',
    icon: LockIcon,
    pages: [
      {
        path: '',
        component: <ModuleAccess />,
      },
      {
        path: [':id'],
        component: <ClusterAccess />,
      },
    ],
    permission: 'view_permission',
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
    ],
    permission: 'view_history',
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
    ],
    permission: 'view_ldap',
  },
  {
    name: 'Setting',
    path: 'setting',
    icon: SettingSmallIcon,
    pages: [
      {
        path: '',
        component: <Setting />,
      },
    ],
    isSideBarHidden: true,
  },
];

const Routes = () => {
  const dispatch = useDispatch();
  const isLicenseValid = useSelector(AuthenticationSelectors.getIsLicenseValid);
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchLicenseInfo')
  );

  useEffect(() => {
    dispatch(AuthenticationActions.fetchLicenseInfo());
    dispatch(SettingsActions.fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settingsData) {
      if (settingsData?.favicon) {
        changeFavicon(settingsData?.favicon);
      }
      document.title = settingsData?.title || 'Data Flow Manager';
    }
  }, [settingsData]);

  function changeFavicon(newFaviconURL) {
    const favicon = document.getElementById('dynamic-favicon');
    if (favicon) {
      favicon.href = newFaviconURL;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = newFaviconURL;
      newFavicon.id = 'dynamic-favicon';
      document.head.appendChild(newFavicon);
    }
  }

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
      <Route path='/policy' element={<UnAuthGuard />}>
        {UNAUTHROUTES_MENU?.map(item => (
          <Route key={item.path} path={item.path} exact element={<Outlet />}>
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
          </Route>))}
      </Route>

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
