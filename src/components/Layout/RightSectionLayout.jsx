import React from 'react';
import rightBoxLogo from '../../assets/Image/right-box-logo.png';
import './index.css';
import { LOGINPAGES } from '../../utils/constants/Login';

export const RightSectionLayout = () => {
  return (
    <div className="col-xl-7 px-0 col-md-6 d-none d-md-block">
      <div className="right-box h-100 w-100 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-2 d-flex justify-content-center align-items-center flex-column">
          <img
            src={rightBoxLogo}
            alt="right-box-logo"
            loading="lazy"
            className="img-fluid right-img"
          />
          <div className="right-text">
            <p>
              {LOGINPAGES.CHECK_OUT_THE_BEST_DATA}{' '}
              <br className="d-md-block d-none" />
              {LOGINPAGES.FLOW_MANAGEMENT_TOOL}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
