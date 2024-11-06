/*eslint-disable*/
import { isEmpty, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';
import { DownArrowIcon } from '../../../../assets';
import { hasError } from '../../../../helpers';
import { theme } from '../../../../styles';
import FieldErrorMessage from '../FieldErrorMessage';

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

  & .react-select__multi-value {
    background-color: ${props => props.theme.colors.lightGrey} !important;
    border-radius: 6px !important;
    padding-block: 4px !important;
  }
  // Wrapper for the select component

  .css-uvrstl {
    max-height: calc(100vh - 810px) !important;

    // Media query for smaller screens
    @media (max-width: 1400px) {
      max-height: calc(100vh - 446px) !important;
    }
  }
`;

const DropdownIndicator = props =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      {props.selectProps.icon && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: 2,
            top: 2,
            bottom: 2,
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

const StyledMultiValChip = styled.div`
  padding: 0 4px;
  border-radius: 4px;
  color: #4c5055;

  & img {
    margin-right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const MultiValueLabel = props => {
  return (
    <components.MultiValueLabel {...props}>
      <StyledMultiValChip>
        {props.data.avatar && <img src={props.data.avatar} alt="avatar" />}
        <span>{props.data.label}</span>
      </StyledMultiValChip>
    </components.MultiValueLabel>
  );
};

MultiValueLabel.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    avatar: PropTypes.string,
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
  placeholder = 'Select...',
  backgroundColor,
  title = '',
  isMulti = false,
  isClearable = false,
  ldap = false,
  handleCreateOption,
  optionEntity = '',
  showCircleIcon = false,
  ...props
}) => {
  const animatedComponents = makeAnimated();
  const error = hasError(errors, name);

  const getBorderColor = ({ isFocused }) => {
    if (isFocused && !error) return theme.colors.darker;
    if (error) return theme.colors.error;
    return theme.colors.border;
  };

  const dot = color => ({
    alignItems: 'center',
    display: 'flex',
    // justifyContent: 'space-between',

    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

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
    multiValueLabel: styles => ({
      ...styles,
      color: theme.colors.darker,
      fontFamily: theme.fontNato,
      fontSize: 14,
      display: 'flex',
      gap: 2,
      backgroundColor: theme.colors.lightGrey,
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
      // minWidth: 'max-content',
      boxShadow: 'none',
      cursor: disabled ? 'not-allowed !important' : 'pointer',
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
    option: (styles, state) => {
      return {
        ...styles,
        ...(showCircleIcon && state.data?.is_active !== undefined
          ? dot(state.data.status == 'Connected' ? '#0CBF59' : '#FF0000')
          : {}),
        fontWeight: 500,
        fontFamily: theme.fontNato,
        backgroundColor: state.isFocused
          ? theme.colors.lightGrey1
          : state.isSelected
            ? theme.colors.lightGrey1
            : 'transparent',
        color: state.isSelected && theme.colors.darker,
        cursor: disabled ? 'not-allowed !important' : 'pointer',
      };
    },
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

  if (ldap) {
    return (
      <CreatableSelect
        isClearable={isClearable}
        classNamePrefix="react-select"
        theme={theme.reactSelecttheme}
        isDisabled={disabled}
        styles={customStyles}
        options={options}
        components={{
          ...animatedComponents,
          IndicatorSeparator: () => null,
          DropdownIndicator,
        }}
        onCreateOption={inputValue => handleCreateOption(inputValue)}
        {...props}
      />
    );
  }
  if (isEmpty(control)) {
    return (
      <Container className={className} title={title}>
        <Select
          isClearable={isClearable}
          classNamePrefix="react-select"
          theme={theme.reactSelecttheme}
          isDisabled={disabled}
          styles={customStyles}
          options={options}
          placeholder={placeholder}
          components={{
            ...animatedComponents,
            IndicatorSeparator: () => null,
            DropdownIndicator,
          }}
          {...props}
        />
      </Container>
    );
  }

  return (
    <Container className={className} title={title}>
      <Controller
        control={control}
        name={name}
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
              isMulti={isMulti}
              isClearable={isClearable}
              classNamePrefix="react-select"
              value={
                isMulti
                  ? options.filter(option => value?.includes(option.value))
                  : options.find(option => option.value === value)
              }
              placeholder={placeholder}
              theme={theme.reactSelecttheme}
              isDisabled={disabled}
              styles={customStyles}
              options={options}
              components={{
                ...animatedComponents,
                IndicatorSeparator: () => null,
                ...(optionEntity === 'user' && {
                  MultiValueLabel: MultiValueLabel,
                }),
                DropdownIndicator,
              }}
              {...props}
              onChange={selected => {
                const uniqueValues = uniqBy(selected, 'value');
                if (isMulti)
                  onChange(uniqueValues.map(option => option?.value));
                else onChange(selected.value);
                if (props.onChange)
                  if (isMulti) props.onChange(uniqueValues);
                  else props.onChange(selected);
              }}
            />
            <FieldErrorMessage errors={errors} name={name} />
          </>
        )}
      />
    </Container>
  );
};

SelectField.propTypes = {
  name: PropTypes.string,
  control: PropTypes.shape({}),
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  errors: PropTypes.shape({}),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.node,
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  onChange: PropTypes.func,
  ldap: PropTypes.bool,
  optionEntity: PropTypes.string,
  handleCreateOption: PropTypes.func,
};

export default SelectField;
