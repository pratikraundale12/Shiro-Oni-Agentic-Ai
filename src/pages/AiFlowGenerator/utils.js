import { toast } from 'react-toastify';
import { KDFM } from '../../constants';

export const getLoginToClusterPopup = () => {
  if (!toast.isActive('clusterLoginError')) {
    toast.error(KDFM.LOGIN_TO_CLUSTER_TO_GENERATE_FLOWS, {
      toastId: 'clusterLoginError',
      autoClose: 500,
    });
  }
};
