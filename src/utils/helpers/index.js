import { get, isEmpty } from 'lodash';

export const hasError = (errors, name) => {
  const error = get(errors, name);
  return !isEmpty(error?.message);
};

export const getFileSize = size => {
  if (size < 1024) {
    return `${size}B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)}MB`;
  }
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
};
