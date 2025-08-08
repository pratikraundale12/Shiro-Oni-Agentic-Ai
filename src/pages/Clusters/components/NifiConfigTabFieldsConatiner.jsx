import React from 'react';
import { InputField } from '../../../shared';
import { TRUE_FALSE_OPTIONS } from '../../../constants';
import { NotePadIcon } from '../../../assets';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import RadioSelectFieldWithWatch from '../../../shared/FormInputs/components/RadioSelectFieldWithWatch';

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
  watch,
}) => {
  const inputStringFields = allNifiProperties?.nifi_properties?.filter(
    ele =>
      (ele?.type === 'string' || ele?.type === 'number') &&
      ele?.priority !== 'true'
  );
  const inputBooleanFields = allNifiProperties?.nifi_properties?.filter(
    ele => ele?.type === 'boolean' && ele?.priority !== 'true'
  );
  const topInputStringFields = allNifiProperties?.nifi_properties?.filter(
    ele =>
      (ele?.type === 'string' || ele?.type === 'number') &&
      ele?.priority === 'true'
  );
  const topInputBooleanFields = allNifiProperties?.nifi_properties?.filter(
    ele => ele?.type === 'boolean' && ele?.priority === 'true'
  );

  return (
    <>
      <div className="row mt-3">
        {isEmpty(allNifiProperties) && (
          <NoDataText className="d-flex justify-content-center mt-4">
            Select NiFi Version
          </NoDataText>
        )}
        {topInputStringFields?.map((input, index) => (
          <div className="col-6" key={index}>
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              required={input.required === 'true'}
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
        ))}
        {topInputBooleanFields?.map(radio => (
          <div className="col-6" key={radio?.name}>
            <RadioSelectFieldWithWatch
              name={radio?.name}
              options={TRUE_FALSE_OPTIONS}
              label={radio?.label}
              register={register}
              defaultValue={'false'}
              watch={watch}
            />
          </div>
        ))}
        <div className="col-6"></div>
        {inputStringFields?.map((input, index) => (
          <div className="col-6" key={index}>
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              required={input.required === 'true'}
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
        ))}
        {inputBooleanFields?.map(radio => (
          <div className="col-5" key={radio?.name}>
            <RadioSelectFieldWithWatch
              name={radio?.name}
              options={TRUE_FALSE_OPTIONS}
              label={radio?.label}
              register={register}
              defaultValue={'false'}
              watch={watch}
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
