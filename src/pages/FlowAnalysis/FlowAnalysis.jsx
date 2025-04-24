import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { PropertyIcon } from '../../assets';
import { CompareValidationIcon } from '../../assets/Icons/CompareValidationIcon';
import { Grid, IconButton, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { NamespacesActions } from '../../store';
import { FlowValidationActions } from '../../store/flowValidation';
import { useGlobalContext } from '../../utils';
import ProcessGroupSorting from '../Namespaces/ProcessGroupSorting';
import AnalyzeNewFlow from './AnalyzeNewFlow';

const StyledButton = styled.button`
  color: #ff7a00;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 400;
  font-size: 15px;
  display: block;
  width: 100%;
  text-align: left;

  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const FlowNameDiv = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 400;
  text-transform: ${props => (props.capitalizeText ? 'capitalize' : 'none')};
  background: none;
  border: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const FlowAnalysis = () => {
  const dispatch = useDispatch();
  const {
    state: { search },
    setState,
  } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(NamespacesActions.resetDeployData());
  }, []);

  const handleEdit = item => {
    dispatch(FlowValidationActions.setSelectedItem(item));
    history.push('/flow-analysis/flow-validation');
  };

  const handleDelete = item => {
    history.push('/flow-analysis/flow-compare');
    dispatch(FlowValidationActions.setSelectedItem(item));
    dispatch(
      NamespacesActions.fetchVersionData({
        bucketId: item.bucketId,
        flowId: item.flowId,
      })
    );
  };

  const state = {
    sortKey: 'name',
    reverse: false,
  };

  const ListForTooltip = item => {
    return (
      <>
        {item?.name && (
          <>
            <li>Name : {item?.name}</li>
            {<li>ID : {item?.id}</li>}
            {!isEmpty(search) && item?.parent && (
              <li>Parent : {item.parent}</li>
            )}
          </>
        )}
      </>
    );
  };
  const COLUMNS = [
    {
      label: (
        <ProcessGroupSorting
          sortProperty="name"
          module="namespaces"
          clickableName={KDFM.NAMESPACE}
        />
      ),
      renderCell: item => (
        <>
          <StyledButton
            data-tooltip-id={`${item?.id}-name`}
            key={item.flowId}
            tabIndex="0"
            onClick={() => {
              setState(prev => ({ ...prev, search: '' }));
              dispatch(NamespacesActions.setFlowPath(item.flowId));
              dispatch(
                NamespacesActions.setSelectedNamespace({
                  label: item.name,
                  value: item.id,
                })
              );
              setCurrentPage(1);
            }}
          >
            {item?.name}
          </StyledButton>
          <ReactTooltip
            id={`${item?.id}-name`}
            place="right"
            // effect="solid"
            content={ListForTooltip(item)}
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '35%',
      resize: true,
    },

    {
      label: (
        <ProcessGroupSorting
          sortProperty="flowName"
          module="namespaces"
          clickableName={KDFM.FLOW_NAME}
        />
      ),
      renderCell: item => (
        <>
          <FlowNameDiv data-tooltip-id={`tooltip-${item.flowName}1`}>
            {item.flowName || KDFM.NA}
          </FlowNameDiv>
          <ReactTooltip
            id={`tooltip-${item?.flowName}1`}
            place="right"
            content={item?.flowName}
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '35%',
      resize: true,
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
      width: '10%',
      resize: true,
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => (
        <div>
          <button
            onClick={() => handleEdit(item)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              marginRight: '5px',
            }}
            data-tooltip-id={`tooltip-edit-${item.id}`}
          >
            <IconButton>
              <PropertyIcon color="#444445" width="16px" height="16px" />
            </IconButton>
          </button>
          <ReactTooltip
            id={`tooltip-edit-${item.id}`}
            place="left"
            content="Flow Validation"
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <button
            onClick={() => handleDelete(item)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            data-tooltip-id={`tooltip-compare-${item.id}`}
          >
            <IconButton>
              <CompareValidationIcon
                color="#444445"
                width="16px"
                height="16px"
              />
            </IconButton>
          </button>
          <ReactTooltip
            id={`tooltip-compare-${item.id}`}
            place="left"
            content="Flow Compare"
            style={{
              width: '125px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </div>
      ),
      width: '20%',
      resize: true,
    },
  ];

  return (
    <>
      <Grid
        isNamespace={true}
        module="namespaces"
        title="Flow Analysis List"
        columns={COLUMNS}
        refreshOptions={REFRESH_OPTIONS}
        placeholder={KDFM.SEARCH_NAMESPACE_FLOW_BUCKET_NAME}
        state={state}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <AnalyzeNewFlow />
    </>
  );
};
export default FlowAnalysis;
