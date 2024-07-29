import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';

import FieldErrorMessage from '../FieldErrorMessage';
import { hasError } from '../../../../utils';
import { theme } from '../../../../styles';
import { DownArrowIcon } from '../../../../assets';

const Container = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

  path {
    fill: ${props => props.theme.colors.darkGrey1};
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.darker};
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }
`;

const DropdownIndicator = props =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      {props.selectProps.icon && (
        <span
          style={{
            display: 'flex',
            position: 'absolute',
            left: 0,
            padding: 14,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            backgroundColor: theme.colors.lightGrey,
          }}
        >
          {props.selectProps.icon}
        </span>
      )}
      <DownArrowIcon />
    </components.DropdownIndicator>
  );

DropdownIndicator.propTypes = {
  selectProps: PropTypes.shape({
    icon: PropTypes.node,
  }).isRequired,
};

const SelectField = ({
  name = '',
  label = '',
  control = {},
  errors = {},
  options = [],
  size = 'md',
  disabled = false,
  required = false,
  className = '',
  backgroundColor,
  ...props
}) => {
  const error = hasError(errors, name);

  const getBorderColor = ({ isFocused }) => {
    if (isFocused && !error) return theme.colors.darker;
    if (error) return theme.colors.error;
    return theme.colors.border;
  };

  const customStyles = {
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: styles => ({
      ...styles,
      ...(size === 'sm' && {
        svg: {
          width: 12,
          height: 12,
        },
      }),
    }),
    dropdownIndicator: styles => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
    }),
    clearIndicator: styles => ({
      ...styles,
      position: 'absolute',
      right: 0,
    }),
    menu: styles => ({
      ...styles,
      zIndex: 99,
    }),
    menuList: styles => ({
      ...styles,
      padding: 0,
    }),
    placeholder: styles => ({
      ...styles,
      fontSize: 14,
      color: theme.colors.darker,
      fontFamily: theme.fontNato,
    }),
    container: styles => ({
      ...styles,
      marginTop: label ? 10 : 0,
    }),
    control: (styles, state) => ({
      ...styles,
      padding: size === 'sm' ? 2 : '8px 4px',
      paddingLeft: props.icon ? 44 : 4,
      minHeight: 0,
      minWidth: 'max-content',
      boxShadow: 'none',
      borderColor: getBorderColor(state),
      backgroundColor: disabled
        ? theme.colors.lightGrey2
        : backgroundColor || theme.colors.white,
      '&:hover': {
        borderColor: theme.colors.darker,
      },
      'svg path': {
        fill: theme.colors.darker,
      },
    }),
    option: (styles, state) => ({
      ...styles,
      fontWeight: 500,
      fontFamily: theme.fontNato,
      backgroundColor: state.isFocused
        ? theme.colors.lightGrey1
        : state.isSelected
          ? theme.colors.lightGrey1
          : 'transparent',
      color: state.isSelected && theme.colors.darker,
    }),
    singleValue: styles => ({
      ...styles,
      fontFamily: theme.fontNato,
      fontWeight: 500,
      fontSize: 14,
    }),
    valueContainer: styles => ({
      ...styles,
    }),
  };

  return (
    <Container className={className}>
      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={({ field: { onChange, value, ref } }) => (
          <>
            {label && (
              <label>
                {label}
                {required && <span className="required">&nbsp;*</span>}
              </label>
            )}
            <Select
              ref={ref}
              value={options.find(option => option.value === value)}
              onChange={option => onChange(option?.value)}
              theme={theme.reactSelecttheme}
              isDisabled={disabled}
              styles={customStyles}
              options={options}
              components={{ IndicatorSeparator: () => null, DropdownIndicator }}
              defaultValue={options[0]}
              // formatOptionLabel={formatOptionLabel}
              {...props}
            />
            <FieldErrorMessage errors={errors} name={name} />
          </>
        )}
      />
    </Container>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  errors: PropTypes.shape({}),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.node,
  backgroundColor: PropTypes.string,
};

export default SelectField;
