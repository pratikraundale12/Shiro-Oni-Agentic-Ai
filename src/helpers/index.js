import { get, isEmpty } from 'lodash';

export const hasError = (errors, name) => {
  const error = get(errors, name);
  return !isEmpty(error?.message);
};

export const changeFavicon = newFaviconURL => {
  const favicon = document.getElementById('dynamic-favicon');
  if (favicon) {
    favicon.href = newFaviconURL;
  } else {
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.href = newFaviconURL;
    newFavicon.id = 'dynamic-favicon';
    document.head.appendChild(newFavicon);
  }
};

export const changeTitle = newTitle => {
  if (document.title) {
    document.title = newTitle;
  } else {
    const newTitleElement = document.createElement('title');
    newTitleElement.textContent = newTitle;
    document.head.appendChild(newTitleElement);
  }
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

export const formatDateStringToLocal = dateString => {
  // Parse the ISO date string into a Date object
  const date = new Date(dateString);

  // Define month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get the components of the date in local time
  const month = months[date.getMonth()]; // getMonth() is already in local time
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours(); // getHours() is already in local time
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format the time
  const time = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Format the complete date string
  return `${month} ${day}, ${year} at ${time}`;
};

export const safeParseJSON = jsonString => {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error(
      `Error parsing JSON: ${jsonString?.substring(0, 50)}...`,
      error
    );
    return {};
  }
};
