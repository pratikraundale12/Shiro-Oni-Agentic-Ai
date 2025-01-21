import React from 'react';
import styled from 'styled-components';
import { SchedularSelectors } from '../../store/schedular';
import { useSelector } from 'react-redux';
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
const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 5px 10px 0px 10px;
  border-radius: 20px;
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
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const DiffScheduleVariables = () => {
  const scheduleDiffData = useSelector(SchedularSelectors.getDiffAllData);
  console.log(scheduleDiffData?.diffVariables, 'scheduleDiffData');
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1 pb-2 ">
        {' '}
        {scheduleDiffData?.diffVariables?.map(element => (
          <div key={element?.pgId} className="mt-2">
            <PgHead className="mb-2">{element?.pgName}</PgHead>
            <GreyBoxNamespace key={element?.pgId}>
              <div className="row mb-3">
                <div className="d-flex">
                  <TileHeader className="col-3">Name</TileHeader>
                  <TileHeader className="col-5">New Value</TileHeader>
                  <TileHeader className="col-4">Current Value</TileHeader>
                </div>
              </div>
              {element?.variables?.map(item => (
                <div className="row mt-2" key={item?.name}>
                  <div className="d-flex">
                    <TileItem className="col-3">{item?.name}</TileItem>
                    <TileItem className="col-5">
                      <span>{item?.new_value}</span>
                    </TileItem>
                    <TileItem className="col-4">{item?.old_value}</TileItem>
                  </div>
                </div>
              ))}
            </GreyBoxNamespace>
          </div>
        ))}
        {isEmpty(scheduleDiffData?.diffVariables) && (
          <div className="d-flex flex-column align-items-center mt-5">
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};
DiffScheduleVariables.propTypes = {};
export default DiffScheduleVariables;
