import { toast } from 'react-toastify';

const activeToasts = new Set();

export const showErrorToast = message => {
  if (!message) return;

  if (activeToasts.has(message)) return;

  activeToasts.add(message);
  toast.error(message);
};
