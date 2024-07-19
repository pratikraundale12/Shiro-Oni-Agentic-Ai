import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import { BrandLogoIcon, ChatBoxIcon } from '../../assets';
import { LOGINPAGES } from '../../utils/constants/Login';

export const LeftSectionLayout = ({ contentDisplay: ContentDisplay }) => {
  return (
    <div className="col-xl-5 px-0 col-md-6 position-relative">
      <div className="left-box forgot-box d-flex justify-content-center align-items-center h-100 flex-column">
        <div className="brand-logo">
          <BrandLogoIcon />
        </div>
        <ContentDisplay />
        <div className="position-relative">
          <div className="version">{LOGINPAGES.VERSION}</div>
          <button className="chat-box-btn">
            <ChatBoxIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

LeftSectionLayout.propTypes = {
  contentDisplay: PropTypes.elementType.isRequired,
};
