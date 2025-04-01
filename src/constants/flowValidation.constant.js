export const FLOWVALIDATION_CONSTANTS = {
  SCOPE_TYPE: 'Scope Type',
  DISPLAY_VALUE: 'Display Value',
  DESCRIPTION: 'Description',
  LASTUPDATE: 'Last Update',
  ACTION: 'Action',
  FLOW_VALIDATION_SETTINGS: 'Flow Validation Settings',
  ADD_NEW_VALIDATION: 'Add New Validation',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SELECT_SCOPE: 'Select Scope',
  SELECT_SCOPE_TYPE: 'Select Scope Type',
  ENTER_DISPLAY_VALUE: 'Enter Display Value',
  ENTER_DESCRIPTION: 'Enter Description',
};

export const SCOPE_TYPE_OPTIONS = [
  { label: 'Processor', value: 'PROCESSOR' },
  { label: 'Connection', value: 'CONNECTION' },
];

export const convertDateTime = dateString => {
  if (!dateString) return 'No date provided';

  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};
