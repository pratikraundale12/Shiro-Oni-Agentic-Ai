import React from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import { theme } from '../styles';

export const getBorderColor = ({ isFocused, error }) => {
  if (isFocused && !error) return theme.colors.primary;
  if (error) return theme.colors.error;
  return theme.colors.borderGrey;
};

export const getSelectStyles = ({ size = 'md', disabled = false }) => ({
  indicatorSeparator: () => ({ display: 'none' }),
  indicatorsContainer: styles => ({
    ...styles,
    ...(size === 'sm' && {
      padding: 0,
      svg: {
        width: 16,
        height: 16,
      },
    }),
  }),
  dropdownIndicator: styles => ({
    ...styles,
    ...(size === 'sm' && {
      padding: 0,
    }),
  }),
  menu: styles => ({
    ...styles,
    zIndex: theme.zIndex.dropdownIndex,
  }),
  placeholder: styles => ({
    ...styles,
    color: theme.colors.grey,
    fontSize: 14,
    fontWeight: 500,
  }),
  control: (styles, state) => ({
    ...styles,
    minHeight: 0,
    boxShadow: 'none',
    borderColor: getBorderColor(state),
    backgroundColor: disabled ? theme.colors.lightGrey2 : theme.colors.white,
  }),
  option: styles => ({
    ...styles,
    fontWeight: 500,
  }),
  singleValue: styles => ({
    ...styles,
    fontWeight: 500,
    fontSize: 14,
  }),
});

export const Dropdown = ({ size = 'md', ...props }) => {
  return (
    <ReactSelect
      styles={{
        ...getSelectStyles({ size }),
      }}
      {...props}
    />
  );
};

Dropdown.propTypes = {
  size: PropTypes.oneOf(['md', 'sm']),
};
