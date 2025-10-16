import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { KDFM } from '../../constants';
import { FullPageLoader, LoaderContainer } from '../../components';
import { NoDataIcon } from '../../assets';
import styled from 'styled-components';
import TreeViewNamespaces from './TreeViewNamespaces';
import PropTypes from 'prop-types';

const LoadingText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const TreeViewWrapper = ({ hideRootNode = false }) => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  useEffect(() => {
    if (
      selectedCluster &&
      (!isEmpty(selectedCluster.label) || !isEmpty(selectedCluster.value))
    ) {
      dispatch(NamespacesActions.fetchNamespacesDownload());
    } else {
      toast.info(KDFM.PLEASE_LOGIN_TO_CLUSTER, {
        toastId: 'please-login-cluster-toast',
      });
    }
  }, [dispatch, selectedCluster]);
  const namespacesDownload = useSelector(
    NamespacesSelectors.getNamespacesDownload
  );

  const fetchingNamespacesDownload = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchNamespacesDownload')
  );

  return (
    <>
      <FullPageLoader loading={fetchingNamespacesDownload} />
      <div className="tree-view-container" style={{ height: '100%' }}>
        {selectedCluster || !isEmpty(selectedCluster?.value) ? (
          <div
            className="border p-3"
            style={{ height: '100%', borderRadius: '15px' }}
          >
            <TreeViewNamespaces
              data={namespacesDownload?.tree}
              width={1600}
              height={680}
              hideRootNode={hideRootNode}
              enableHoverApi={true}
            />
          </div>
        ) : (
          <LoaderContainer>
            <NoDataIcon width={140} />
            <LoadingText>{KDFM.NO_PROCESS_GROUP} </LoadingText>
          </LoaderContainer>
        )}
      </div>
    </>
  );
};

export default TreeViewWrapper;

TreeViewWrapper.propTypes = {
  hideRootNode: PropTypes.bool,
};
