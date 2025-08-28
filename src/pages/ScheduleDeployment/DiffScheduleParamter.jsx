import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon } from '../../assets';
import { SchedularSelectors } from '../../store/schedular';

const DataWrapper = styled.div`
  width: 100%;
  gap: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
  max-width: 100%;
  overflow-x: hidden;
`;

const ScrollSetGrey = styled.div`
  height: calc(100vh - 410px);
  max-height: calc(100vh - 410px);
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 1024px) {
    height: calc(100vh - 380px);
    max-height: calc(100vh - 380px);
  }

  @media (max-width: 768px) {
    height: calc(100vh - 350px);
    max-height: calc(100vh - 350px);
  }

  /* Fix horizontal scroll issues */
  & table,
  & tr,
  & td {
    max-width: 100%;
    table-layout: fixed;
  }
`;

const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  border-radius: 15px;
  padding: 20px 15px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const PgHead = styled.div`
  font-family: Red Hat Display;
  font-size: 20px;
  font-weight: 700;
  line-height: 26.46px;
  letter-spacing: -0.005em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

const TileHeader = styled.div`
  font-family: Red Hat Display;
  font-size: 17px;
  font-weight: 600;
  line-height: 22.49px;
  letter-spacing: -0.005em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 20px;
  }
`;

const TileItem = styled.div`
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ResponsiveRow = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: ${props => (props.stacked ? 'column' : 'row')};
  }
`;

const ColumnLabel = styled(TileHeader)`
  width: 25%;

  @media (max-width: 1024px) {
    width: 30%;
  }

  @media (max-width: 768px) {
    width: ${props => (props.stacked ? '100%' : '30%')};
    margin-bottom: ${props => (props.stacked ? '8px' : '0')};
  }
`;

const ColumnValue = styled(TileItem)`
  width: 40%;
  padding-right: 8px;

  @media (max-width: 1024px) {
    width: 35%;
  }

  @media (max-width: 768px) {
    width: ${props => (props.stacked ? '100%' : '35%')};
  }
`;

const ColumnCurrent = styled(TileItem)`
  width: 35%;

  @media (max-width: 1024px) {
    width: 35%;
  }

  @media (max-width: 768px) {
    width: 35%;
  }
`;

const ValueBox = styled.div`
  background-color: #e9ecf1;
  border-radius: 12px;
  margin: 2px 0px 1px 0px;
  padding: 8px;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  white-space: normal;
`;

const HeaderRow = styled.div`
  display: flex;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const ParameterHeader = styled.div`
  background-color: #e9ecf1;
  height: 30px;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 8px;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const DiffScheduleParameter = ({
  parametersData,
  isFromDeploySummary = false,
}) => {
  const scheduleDiffData = useSelector(SchedularSelectors.getDiffAllData);
  const data = isFromDeploySummary
    ? parametersData
    : scheduleDiffData?.diffParameters;

  // Function to check if a parameter is sensitive
  const isSensitiveParameter = parameterName => {
    const sensitiveKeywords = [
      'password',
      'secret',
      'key',
      'token',
      'credential',
      'auth',
      'api_key',
      'private',
      'secure',
    ];

    return sensitiveKeywords.some(keyword =>
      parameterName.toLowerCase().includes(keyword)
    );
  };

  // Function to mask sensitive values
  const maskSensitiveValue = (value, parameterName) => {
    if (isSensitiveParameter(parameterName)) {
      return '******';
    }
    return value;
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {data?.map(element => (
          <div className="mt-4" key={element?.parameterName}>
            <PgHead className="mb-2">{element?.parameterName}</PgHead>
            <GreyBoxNamespace>
              {/* Header row - same for both cases */}
              <HeaderRow>
                <ColumnLabel></ColumnLabel>
                <ColumnValue>
                  <TileHeader>New</TileHeader>
                </ColumnValue>
                <ColumnCurrent>
                  <TileHeader>Current</TileHeader>
                </ColumnCurrent>
              </HeaderRow>

              {element?.parameters?.map(item => {
                // Handle different data structures
                const rawNewValue =
                  item?.new_value?.value === ''
                    ? 'Empty String Set'
                    : item?.new_value?.value === null
                      ? 'No Value set'
                      : item?.new_value?.value;

                const rawOldValue =
                  item?.old_value?.value === ''
                    ? 'Empty String Set'
                    : item?.old_value?.value === null
                      ? 'No Value set'
                      : item?.old_value?.value;

                // Apply masking for sensitive parameters
                const newValue = maskSensitiveValue(rawNewValue, item?.name);
                const oldValue = maskSensitiveValue(rawOldValue, item?.name);

                const newDescription = item?.new_value?.description;
                const oldDescription = item?.old_value?.description;

                return (
                  <div key={item?.name}>
                    <ParameterHeader>
                      <span>{item?.name}</span>
                    </ParameterHeader>

                    {/* Value row - same structure for both cases */}
                    {(rawNewValue || rawOldValue) && (
                      <ResponsiveRow className="mb-2">
                        <ColumnLabel className="d-flex align-items-center">
                          Value
                        </ColumnLabel>
                        <ColumnValue>
                          <ValueBox>{newValue || 'N/A'}</ValueBox>
                        </ColumnValue>
                        <ColumnCurrent>
                          <ValueBox>{oldValue || 'N/A'}</ValueBox>
                        </ColumnCurrent>
                      </ResponsiveRow>
                    )}

                    {/* Description row - same structure for both cases */}
                    {(newDescription || oldDescription) && (
                      <ResponsiveRow className="mb-2">
                        <ColumnLabel className="d-flex align-items-center">
                          Description
                        </ColumnLabel>
                        <ColumnValue>
                          <ValueBox>{newDescription || 'N/A'}</ValueBox>
                        </ColumnValue>
                        <ColumnCurrent>
                          <ValueBox>{oldDescription || 'N/A'}</ValueBox>
                        </ColumnCurrent>
                      </ResponsiveRow>
                    )}
                  </div>
                );
              })}
            </GreyBoxNamespace>
          </div>
        ))}

        {/* No data condition - check both data sources */}
        {isEmpty(data) && (
          <div className="d-flex flex-column align-items-center mt-5">
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

DiffScheduleParameter.propTypes = {
  parametersData: PropTypes.array,
  isFromDeploySummary: PropTypes.bool,
};

export default DiffScheduleParameter;
