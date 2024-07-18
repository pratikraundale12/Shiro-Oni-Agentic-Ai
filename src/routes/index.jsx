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
} from '../pages';

export const ROUTES_MENU = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    pages: [
      {
        path: '',
        component: <ListDashBoard />,
      },
    ],
  },
  {
    name: 'User',
    path: 'user',
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
    name: 'Cluster',
    path: 'cluster',
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
