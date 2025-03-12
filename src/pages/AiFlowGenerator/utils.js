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

export const validatePayload = (payload, requiredFields) => {
  console.log('payload--', payload);
  console.log(process.env.REACT_APP_API_URL);
  const fieldLabels = {
    session_id: 'Session ID',
    query: 'Query',
    embedding_model: 'Embedding Model',
    engine: 'Engine',
    dept_id: 'Department ID',
    org_id: 'Organization ID',
    user_id: 'User ID',
    type: 'Type',
  };

  const missingFields = requiredFields
    .filter(field => !payload[field])
    .map(field => fieldLabels[field] || field);

  if (missingFields.length > 1) {
    toast.error(`${missingFields.join(', ')} are required`);
    return false;
  } else if (missingFields.length == 1) {
    toast.error(`${missingFields.join(', ')} is required`);
    return false;
  }
  return true;
};

export const formattedTime = () => {
  const now = new Date();

  const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const period = now.getHours() >= 12 ? 'PM' : 'AM';

  return `${hours}: ${minutes} ${period} ${now.getDate()}: ${minutes}: ${seconds}`;
};

export const downloadJsonFile = (jsonData, fileName = 'demo.json') => {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url); // Clean up memory
};
