import React from 'react';
import { InputField, RadioSelectField } from '../../../shared';
import { TRUE_FALSE_OPTIONS } from '../../../constants';
import { NotePadIcon } from '../../../assets';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const NifiConfigTabFieldsContainer = ({
  register,
  errors,
  allNifiProperties,
}) => {
  const inputStringFields = allNifiProperties?.nifi_properties?.filter(
    ele => ele?.type === 'string' || ele?.type === 'number'
  );
  const inputBooleanFields = allNifiProperties?.nifi_properties?.filter(
    ele => ele?.type === 'boolean'
  );

  return (
    <>
      <div className="row mt-3">
        {isEmpty(allNifiProperties) && (
          <NoDataText className="d-flex justify-content-center mt-4">
            Select NiFi Version
          </NoDataText>
        )}
        {inputStringFields?.map((input, index) => (
          <div className="col-6" key={index}>
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              required={input.required}
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
        ))}
        {/* {inputObject.map((input, index) => (
          <div className="col-6" key={index}>
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              required={input.required}
              register={register}
              errors={errors}
              icon={input.icon}
            />
          </div>
        ))} */}
        {/* {passwordObject.map((password, index) => (
          <div className="col-6" key={index}>
            <PasswordField
              label={password.label}
              name={password.name}
              placeholder={password.placeholder}
              required={password.required}
              register={register}
              errors={errors}
              icon={password.icon}
              watch={watch}
            />
          </div>
        ))}
        {radioObjectArray?.map(radio => (
          <div className="col-5" key={radio?.name}>
            <RadioSelectField
              name={radio?.name}
              options={TRUE_FALSE_OPTIONS}
              label={radio?.label}
              register={register}
              defaultValue={'false'}
            />
          </div>
        ))} */}
        {inputBooleanFields?.map(radio => (
          <div className="col-5" key={radio?.name}>
            <RadioSelectField
              name={radio?.name}
              options={TRUE_FALSE_OPTIONS}
              label={radio?.label}
              register={register}
              defaultValue={'false'}
            />
          </div>
        ))}
      </div>
    </>
  );
};
NifiConfigTabFieldsContainer.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  watch: PropTypes.func,
  allNifiProperties: PropTypes.object,
};
export default NifiConfigTabFieldsContainer;
