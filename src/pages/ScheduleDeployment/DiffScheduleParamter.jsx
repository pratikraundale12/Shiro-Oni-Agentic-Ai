import React from 'react';
import styled from 'styled-components';
import { SchedularSelectors } from '../../store/schedular';
import { useSelector } from 'react-redux';
import { theme } from '../../styles';

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
const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 5px 10px 0px 10px;
  border-radius: 15px;
  padding: 20px 15px 20px 15px;
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
//
const DiffScheduleParameter = () => {
  const scheduleDiffData = useSelector(SchedularSelectors.getDiffAllData);
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {scheduleDiffData?.diffParameters?.map(element => (
          <div className="mt-4" key={element?.parameterName}>
            <PgHead className="mb-2">{element?.parameterName}</PgHead>
            <GreyBoxNamespace>
              <div className="d-flex mb-3">
                <TileHeader className="col-3"></TileHeader>
                <TileHeader className="col-5">New</TileHeader>
                <TileHeader className="col-4">Current</TileHeader>
              </div>
              {element?.parameters?.map(item => (
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
                        {element?.parameters?.[0]?.new_value?.value}
                      </span>
                    </TileItem>
                    <TileItem className="col-4">
                      {element?.parameters?.[0]?.old_value?.value}
                    </TileItem>
                  </div>
                  <div className="d-flex">
                    <TileHeader className="col-3">Description</TileHeader>
                    <TileItem className="col-5">
                      <span
                        style={{
                          backgroundColor: '#E9ECF1',
                          borderRadius: '12px',
                        }}
                        className="p-2"
                      >
                        {element?.parameters?.[0]?.new_value?.description ||
                          'N/A'}
                      </span>
                    </TileItem>
                    <TileItem className="col-4">
                      {element?.parameters?.[0]?.old_value?.description ||
                        'N/A'}
                    </TileItem>
                  </div>
                </div>
              ))}
            </GreyBoxNamespace>
          </div>
        ))}
      </ScrollSetGrey>
    </DataWrapper>
  );
};
DiffScheduleParameter.propTypes = {};
export default DiffScheduleParameter;
