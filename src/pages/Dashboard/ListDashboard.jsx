import React, { useEffect, useState } from 'react';
import SessionExpiredLabel from '../../shared/sessionExpiredLabel';
import { getLicenseExpiresData } from '../../utils/services';

export const ListDashBoard = () => {
  const [displaySessionTab, setDisplaySessionTab] = useState(false);
  const getLicenseData = async () => {
    const reponse = await getLicenseExpiresData();
    console.log(reponse, '>>>>>>>>');
  };
  useEffect(() => {
    getLicenseData();
    const timer = setTimeout(() => {
      setDisplaySessionTab(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const closeTab = () => {
    setDisplaySessionTab(false);
  };
  return (
    <div>
      Dashboard List
      {displaySessionTab && <SessionExpiredLabel closeTab={closeTab} />}
    </div>
  );
};
