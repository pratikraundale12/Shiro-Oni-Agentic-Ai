import React from 'react';
import { Controller } from 'react-hook-form';
import styled, { useTheme } from 'styled-components';
import PropTypes from 'prop-types';
import Select from 'react-select';

import FieldErrorMessage from '../FieldErrorMessage';
import { hasError } from '../../../../utils';

export const Container = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

  path {
    fill: ${props => props.theme.colors.darkGrey1};
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 15.06px;
    margin-bottom: 5px;
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }
`;

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
  ...props
}) => {
  const theme = useTheme();
  const error = hasError(errors, name);

  const getBorderColor = ({ isFocused }) => {
    if (isFocused && !error) return theme.colors.primary;
    if (error) return theme.colors.error;
    return theme.colors.darkGrey;
  };

  const customStyles = {
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
      color: theme.colors.darkGrey1,
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
              value={value && options.find(option => option.value === value)}
              onChange={option => onChange(option?.value)}
              theme={theme.reactSelecttheme}
              isDisabled={disabled}
              options={options}
              styles={{
                ...customStyles,
                dropdownIndicator: styles => ({
                  ...styles,
                  padding: 0,
                }),
              }}
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
};

export default SelectField;
