import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  &:hover .custom-tooltip-model {
    display: block;
  }
`;

const TooltipText = styled.span`
  cursor: pointer;
`;

const TooltipModel = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0px;
  z-index: 10;
  width: 250px;
  padding-top: 25px;
`;

const TooltipContent = styled.div`
  margin: auto;
  max-height: 180px;
  overflow: auto;
  background-color: #fff;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  color: #444445;
`;

const TooltipList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TooltipItem = styled.li``;

export const CustomTooltip = ({ data = [], title = '' }) => {
  return (
    <TooltipWrapper className="custom-tooltip">
      <TooltipText className="cursor-pointer">{title}</TooltipText>
      <TooltipModel className="custom-tooltip-model">
        <TooltipContent className="custom-tooltip-content">
          <TooltipList>
            {data?.map((item, index) => (
              <TooltipItem key={index}>{item?.username}</TooltipItem>
            ))}
          </TooltipList>
        </TooltipContent>
      </TooltipModel>
    </TooltipWrapper>
  );
};

CustomTooltip.prototype;

CustomTooltip.propTypes = {
  data: PropTypes.array,
  title: PropTypes.any,
};
