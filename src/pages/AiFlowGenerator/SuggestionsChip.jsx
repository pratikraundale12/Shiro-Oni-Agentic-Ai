import React from 'react';
import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PropTypes from 'prop-types';
import { AiFlowSuggestionsIcon } from '../../assets/Icons/AiFlowSuggestionsIcon';

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  max-width: 100%;
  padding: 8px;
  white-space: nowrap;
  cursor: pointer;

  @media (max-width: 768px) {
    max-width: 90vw;
  }
`;

const Chip = styled.div`
  color: #ff7a00;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChipContainer = styled.div`
  display: flex;
  padding: 6px 12px;
  border: 1px solid #ff7a00;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  width: auto;
  max-width: 250px;
  gap: 3px;
`;

const SuggetionsChip = ({ SuggetionsArray, setQueryText, setQueryLable }) => {
  return (
    <ChipWrapper>
      {SuggetionsArray?.slice(0, 4)?.map((item, index) => (
        <>
          <ChipContainer
            onClick={() => {
              setQueryLable(item?.name);
              setQueryText(item?.query);
            }}
          >
            <AiFlowSuggestionsIcon />
            <Chip key={index} data-tooltip-id={`flow-name-${item.id}`}>
              {item?.name}
            </Chip>
          </ChipContainer>
          <ReactTooltip
            id={`flow-name-${item.id}`}
            place="right"
            content={item.name}
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ))}
    </ChipWrapper>
  );
};

export default SuggetionsChip;

SuggetionsChip.propTypes = {
  SuggetionsArray: PropTypes.array.isRequired,
  setQueryText: PropTypes.func.isRequired,
  setQueryLable: PropTypes.func.isRequired,
};
