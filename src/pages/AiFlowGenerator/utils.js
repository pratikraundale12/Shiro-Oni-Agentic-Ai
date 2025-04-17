import { toast } from 'react-toastify';
import { KDFM } from '../../constants';

export const getLoginToClusterPopup = () => {
  if (!toast.isActive('clusterLoginError')) {
    toast.error(KDFM.LOGIN_TO_CLUSTER_TO_GENERATE_FLOWS, {
      toastId: 'clusterLoginError',
    });
  }
};

export const validatePayload = (payload, requiredFields) => {
  const fieldLabels = {
    session_id: 'Session ID',
    query: 'Query',
    logged_in_user: 'LoggedIn User',
    user_role: 'Role',
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
  const period = now.getHours() >= 12 ? 'PM' : 'AM';
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(now.getFullYear()).slice(-2); // Get last two digits of year

  return `${hours}:${minutes} ${period} ${day}-${month}-${year}`;
};
export const downloadJsonFile = (jsonData, fileName = 'demo.json', refresh) => {
  try {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success('Flow downloaded successfully!', {
      toastId: 'download-success',
    });
    refresh();
  } catch (error) {
    toast.error('Failed to download the flow. Please try again.', {
      toastId: 'download-error',
    });
  }
};

export const validateInput = input => {
  const normalizedInput = input.replace(/\s{2,}/g, ' ');
  const cleanedInput = normalizedInput.trim();
  const isValid = cleanedInput;

  return { isValid, cleanedInput };
};
