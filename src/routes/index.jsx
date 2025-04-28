import React, { useEffect } from 'react';
import { Outlet, Route, useLocation } from 'react-router-dom';

import AuthGaurd from './AuthGuard';
import { HistoryRouter } from './HistoryRouter';

import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityHistoryIcon,
  BookIcon,
  ClusterIcon,
  DashboardIcon,
  DataFlowInventoryIcon,
  GenAiIcon,
  LdapConfigIcon,
  LicenseIcon,
  LockIcon,
  NameSpaceIcon,
  PeopleIcon,
  PropertyIcon,
  QuestionMarkIcon,
  ReadyFlowIcon,
  RegistryIcon,
  ScheduleDeploymentIcon,
  SettingSmallIcon,
} from '../assets';
import { FullPageLoader } from '../components';
import KeycloakRedirectPage from '../components/KeyCloak/KeycloakRedirectPage.jsx';
import { KDFM } from '../constants/index.js';
import {
  ActvityHistory,
  Add,
  AiFlowGenerator,
  ClusterAccess,
  Dashboard,
  Forgot,
  HelpAndSupport,
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
  // Setting,
  Success,
  UserLogin,
} from '../pages';
import AzureCallbackHandler from '../pages/Auth/AzureCallbackHandler.jsx';
import { ClusterSummary } from '../pages/Clusters/ClusterSummary';
import ClusterSetupNewConfigDetailsPage from '../pages/Clusters/components/ClusterSetupNewConfigDetail.jsx';
import SetupClusterPage from '../pages/Clusters/components/setupClusterPage.jsx';
import { ListControllerService } from '../pages/ControllerService';
import DataFlowInventry from '../pages/DataFlowInventory/DataFlowInventry.jsx';
import CompareValidation from '../pages/FlowAnalysis/CompareValidation.jsx';
import FlowAnalysis from '../pages/FlowAnalysis/FlowAnalysis.jsx';
import FlowValidationDetails from '../pages/FlowAnalysis/FlowValidationDetails.jsx';
import License from '../pages/Licensing/License.jsx';
import ConfigDetailsPage from '../pages/Namespaces/ConfigDetailsPage.jsx';
import DeployPage from '../pages/Namespaces/DeployPage.jsx';
import FlowDetailsPage from '../pages/Namespaces/FlowDetailsPage.jsx';
import ListControllerServiceNamespace from '../pages/Namespaces/ListControllerServiceNamespace';
import ProcessGroupSummary from '../pages/Namespaces/ProcessGroupSummary';
import Summary from '../pages/Namespaces/Summary';
import Upgrade from '../pages/Namespaces/Upgrade';
import { ListScheduleDeployment } from '../pages/ScheduleDeployment';
import SettingTab from '../pages/SettingPage/SettingTab.jsx';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../store';
import { SettingsActions, SettingsSelectors } from '../store/settings';
import RedirectToLogin from './RedirectToLogin.jsx';
import UnAuthGuard, { UNAUTHROUTES_MENU } from './UnAuthGuard';
import RegistryManagementPage from '../pages/Registry/ListRegistryManagement.jsx';

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
    name: 'Clusters',
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
        path: ['setup-cluster'],
        component: <SetupClusterPage />,
      },
      {
        path: ['new-config-details'],
        component: <ClusterSetupNewConfigDetailsPage />,
      },
      {
        path: [':id'],
        component: <ClusterSummary />,
      },
    ],
    permission: 'view_cluster',
  },
  {
    name: 'Process Groups',
    path: 'process-group',
    icon: NameSpaceIcon,
    pages: [
      {
        path: '',
        component: <ListNamespaces />,
      },
      {
        path: [':id'],
        component: <ProcessGroupSummary />,
      },
      {
        path: 'upgrade',
        component: <Upgrade />,
      },
      {
        path: 'controller',
        component: <ListControllerServiceNamespace />,
      },
      {
        path: 'summary',
        component: <Summary />,
      },
      {
        path: 'deploypage',
        component: <DeployPage />,
      },
      {
        path: 'flow-details',
        component: <FlowDetailsPage />,
      },
      {
        path: 'config-details',
        component: <ConfigDetailsPage />,
      },
    ],
    permission: 'view_namespace',
  },
  {
    name: 'Flow Analysis',
    path: 'flow-analysis',
    icon: PropertyIcon,
    pages: [
      {
        path: '',
        component: <FlowAnalysis />,
      },
      {
        path: 'flow-validation',
        component: <FlowValidationDetails />,
      },
      {
        path: 'flow-compare',
        component: <CompareValidation />,
      },
    ],
    permission: 'view_namespace',
  },
  {
    name: 'Deployment Schedule',
    path: 'schedule-deployment',
    icon: ScheduleDeploymentIcon,
    pages: [
      {
        path: '',
        component: <ListScheduleDeployment />,
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
    name: 'Data Flow Inventory',
    path: 'data-flow-inventory',
    icon: DataFlowInventoryIcon,
    pages: [
      {
        path: '',
        component: <DataFlowInventry />,
      },
    ],
    permission: 'view_data_inventory',
  },
  {
    name: KDFM.AI_FLOW_GENERATOR,
    path: 'ai-flow-generator',
    icon: GenAiIcon,
    pages: [
      {
        path: '',
        component: <AiFlowGenerator />,
      },
    ],
    permission: 'view_genai',
  },
  {
    name: 'Registry',
    path: 'registry-management',
    icon: RegistryIcon,
    pages: [
      {
        path: '',
        component: <RegistryManagementPage />,
      },
    ],
    permission: 'view_cluster',
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
    name: 'Roles & Permissions',
    path: 'role-&-permission',
    icon: LockIcon,
    pages: [
      {
        path: '',
        component: <ModuleAccess />,
      },
      {
        path: ['cluster-access'],
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
    name: 'Controller Service',
    path: 'controller-service',
    icon: BookIcon,
    pages: [
      {
        path: '',
        component: <ListControllerService />,
      },
    ],
    permission: 'view_controller_services',
  },
  {
    name: 'Settings',
    path: 'setting',
    icon: SettingSmallIcon,
    pages: [
      {
        path: '',
        component: <SettingTab />,
      },
    ],
    permission: 'view_setting',
  },
  {
    name: 'Licensing',
    path: 'licensing',
    icon: LicenseIcon,
    pages: [
      {
        path: '',
        component: <License />,
      },
    ],
    permission: 'view_setting',
  },
  {
    name: 'Help & Support',
    path: 'help-&-support',
    icon: QuestionMarkIcon,
    pages: [
      {
        path: '',
        component: <HelpAndSupport />,
      },
    ],
    permission: 'view_ldap',
  },
];

const Routes = () => {
  const dispatch = useDispatch();
  const isLicenseValid = useSelector(AuthenticationSelectors.getIsLicenseValid);
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchLicenseInfo')
  );
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/login' ||
      location.pathname === '/admin/login'
    ) {
      dispatch(AuthenticationActions.fetchSettingLogo());
      dispatch(AuthenticationActions.fetchLicenseInfo());
    }
    if (
      [
        '/setting',
        '/controller-service',
        '/ldap-configuration',
        '/help-&-support',
        '/role-&-permission',
        '/activity-history',
        '/user-management',
        '/schedule-deployment',
        '/process-group',
        '/clusters',
        '/dashboard',
        '/licensing',
        '/ai-flow-generator',
        '/data-flow-inventory',
      ].includes(location.pathname)
    ) {
      dispatch(SettingsActions.fetchSettings());
      dispatch(AuthenticationActions.fetchLicenseInfo());
    }
  }, [dispatch, location.pathname]);

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

  if (isLicenseValid === false) return <SessionExpired />;

  if (loading) return <FullPageLoader loading={loading} />;

  return (
    <HistoryRouter>
      {/* Public Routes */}
      <Route
        path="/api/auth/azure/callback"
        element={<AzureCallbackHandler />}
      />
      <Route path="/keycloakLogin" element={<KeycloakRedirectPage />} />
      <Route path="/back-to-login" element={<RedirectToLogin />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/policy" element={<UnAuthGuard />}>
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
          </Route>
        ))}
      </Route>

      {/* Private Routes */}
      <Route path="/" element={<AuthGaurd />}>
        {ROUTES_MENU?.filter(item => !item.hidden)?.map(item => (
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
