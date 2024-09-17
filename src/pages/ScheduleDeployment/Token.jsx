import React, { useEffect, useState } from 'react';
import { FullPageLoader } from '../../components';
import { useLocation } from 'react-router-dom';
import { SchedularActions } from '../../store/schedular/redux';
import { useDispatch } from 'react-redux';

const TokenPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [urlToken, setUrlToken] = useState('');
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  };
  useEffect(() => {
    const token = getTokenFromUrl();
    setUrlToken(token);
  }, []);

  useEffect(() => {
    if (urlToken) {
      dispatch(
        SchedularActions.checkApproverToken({ params: { token: urlToken } })
      );
    }
  }, [urlToken]);

  return <FullPageLoader loading />;
};
export default TokenPage;
