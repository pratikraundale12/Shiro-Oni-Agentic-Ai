import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { ROUTES_MENU } from '../../routes';

export const Sidebar = () => {
  const [activeRoute, setActiveRoute] = useState(ROUTES_MENU[0].path);
  const navigate = useNavigate();

  const handleRouteClick = path => {
    setActiveRoute(path);
    navigate(`/${path}`);
  };

  const handleKeyDown = (event, path) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleRouteClick(path);
    }
  };

  return (
    <>
      <button
        className="slider-btn position-absolute d-flex align-items-center justify-content-center d-lg-none d-block bg-white p-1"
        type="button"
        id="toggleButton"
      >
        <img
          src="./img/icons/slider-btn.webp"
          alt="arrow-icon"
          width={14}
          height={14}
        />
      </button>

      <div
        className="sidebar-main-view flex-column d-flex align-items-start justify-content-between"
        id="MenuSidebarMobileView2"
      >
        <div className="w-100">
          <ul className="ps-0 w-100 mb-0">
            {ROUTES_MENU.map((route, index) => (
              <li
                key={index}
                className={`sidebar-list d-flex align-items-center position-relative ${activeRoute === route.path ? 'active' : ''}`}
                onClick={() => handleRouteClick(route.path)}
                onKeyDown={event => handleKeyDown(event, route.path)}
                role="button"
                tabIndex={0}
              >
                <div className="sidebar-icons">{route.icon}</div>
                <span>{route.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
