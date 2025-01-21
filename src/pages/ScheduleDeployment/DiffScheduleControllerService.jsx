import React from 'react';
import styled from 'styled-components';

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

const DiffScheduleCS = () => {
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1"></ScrollSetGrey>
    </DataWrapper>
  );
};
DiffScheduleCS.propTypes = {};
export default DiffScheduleCS;
