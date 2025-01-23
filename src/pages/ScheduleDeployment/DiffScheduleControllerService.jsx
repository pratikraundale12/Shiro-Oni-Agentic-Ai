import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SchedularSelectors } from '../../store/schedular';
import { theme } from '../../styles';
import { NoDataIcon } from '../../assets';
import { isEmpty } from 'lodash';

const DataWrapper = styled.div`
  width: 100%;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
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
`;
const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 5px 10px 0px 10px;
  border-radius: 15px;
  padding: 20px 15px 20px 15px;
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
`;
const TileItem = styled.div`
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const WarningSection = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.primary};
`;
const DiffScheduleCS = () => {
  const scheduleDiffData = useSelector(SchedularSelectors.getDiffAllData);
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {!isEmpty(scheduleDiffData?.diffControllerServices) && (
          <WarningSection className="mt-2">
            * External controller services changes take effect immediately when
            changed, so the changes made are not listed here
          </WarningSection>
        )}

        {scheduleDiffData?.diffControllerServices?.map(element => (
          <div className="mt-4" key={element?.identifier}>
            <PgHead className="mb-2">{element?.name}</PgHead>
            <GreyBoxNamespace>
              <div className="d-flex mb-3">
                <TileHeader className="col-3"></TileHeader>
                <TileHeader className="col-5">New</TileHeader>
                <TileHeader className="col-4">Current</TileHeader>
              </div>
              {element?.property_differences?.map(item => (
                <div className="row mb-4 mt-2" key={item?.name}>
                  <TileHeader
                    style={{
                      backgroundColor: '#E9ECF1',
                      height: '30px',
                      color: theme.colors.primary,
                      // borderRadius: '12px',
                    }}
                    className="d-flex align-items-center mb-3"
                  >
                    <span className="p-2">{item?.name}</span>
                  </TileHeader>
                  <div className="d-flex mb-4">
                    <TileHeader className="col-3">Value</TileHeader>
                    <TileItem className="col-5">
                      <span
                        style={{
                          backgroundColor: '#E9ECF1',
                          borderRadius: '12px',
                        }}
                        className="p-2"
                      >
                        {item?.new_value || 'N/A'}
                      </span>
                    </TileItem>
                    <TileItem className="col-4">
                      {item?.old_value || 'N/A'}
                    </TileItem>
                  </div>
                </div>
              ))}
            </GreyBoxNamespace>
          </div>
        ))}
        {isEmpty(scheduleDiffData?.diffControllerServices) && (
          <div className="d-flex flex-column align-items-center mt-5">
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};
DiffScheduleCS.propTypes = {};
export default DiffScheduleCS;
