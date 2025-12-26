import React from 'react';
import {
  // useDispatch,
  useSelector,
} from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
// import { toast } from 'react-toastify';
// import { ClusterIcon, DownArrowIcon } from '../../assets';
// import { KDFM } from '../../constants';
import {
  //   AuthenticationActions,
  AuthenticationSelectors,
  //   ClustersActions,
  //   LoadingSelectors,
  NamespacesSelectors,
} from '../../store';

const IconCusterButton = styled.button`
  min-width: 50px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  gap: 10px;
  padding: 0 12px;
  background-color: #f5f7fa;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 220px;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-shrink: 1;

  &:hover {
    background-color: #ebedf0;
  }
`;

const NameDiv = styled.div`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const ClusterLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusDiv = styled.div`
  width: 8px;
  height: 8px;
  background-color: #0cbf59;
  border-radius: 50%;
  margin-right: 6px;
`;

export const ShowLoggedInCluster = () => {
  //   const dispatch = useDispatch();

  // Selectors moved from Header
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  //   const flowGenrating = useSelector(state =>
  //     LoadingSelectors.getLoading(state, 'generateFlowAPI')
  //   );

  //   const handleClusterClick = () => {
  //     if (flowGenrating) {
  //       if (!toast.isActive('generating-flow')) {
  //         toast.warning('Flow is generating please wait', {
  //           toastId: 'generating-flow',
  //         });
  //       }
  //       return;
  //     }
  //     // Open the cluster login/selection modal
  //     dispatch(AuthenticationActions.setClusterLogin(true));
  //     dispatch(ClustersActions.fetchClusters({ params: { page: 1 } }));
  //   };

  // Permission Check
  const canViewCluster =
    !isEmpty(currentUser?.permissions) &&
    currentUser?.permissions?.includes('view_cluster');

  if (!canViewCluster) return null;
  if (!selectedCluster?.label) return null;
  return (
    <IconCusterButton
      id="modal-cluster-icon-btn"
      //   onClick={handleClusterClick}
      type="button"
    >
      {/* <ClusterIcon width={18} height={18} style={{ flexShrink: 0 }}/> */}
      <NameDiv>
        {
          selectedCluster?.label ? (
            <>
              <StatusDiv style={{ flexShrink: 0 }} />
              <ClusterLabel>{selectedCluster.label}</ClusterLabel>
            </>
          ) : null
          // (
          //   <span>{KDFM.SELECT_CLUSTER}</span>
          // )
        }
      </NameDiv>
      {/* <DownArrowIcon style={{ flexShrink: 0 }}/> */}
    </IconCusterButton>
  );
};
