import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SanityCheckIcon } from '../../assets';
import { FullPageLoader } from '../../components';
import { Button } from '../../shared';
import { LoadingSelectors } from '../../store';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import SanityCheckCollapsableItem from '../Namespaces/SanityCheckCollapsableItem';

const DataWrapper = styled.div`
  width: 100%;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  height: calc(100vh - 410px);
  max-height: calc(100vh - 410px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const BottomButtonWrapper = styled.div`
  padding: 1rem;
  border-top: 1px solid #dde4f0;
`;

const DiffSanityCheck = () => {
  const dispatch = useDispatch();
  const sanityCheckData = useSelector(
    SchedularSelectors.getSanityAndDeployStatus
  );
  console.log('sanityCheckData', sanityCheckData);

  // Reset modal state when component mounts
  useEffect(() => {
    dispatch(SchedularActions.setIsSanityCheckScheduleModalOpen(false));
  }, [dispatch]);

  const handleSanityCheck = () => {
    dispatch(SchedularActions.setIsSanityCheckScheduleModalOpen(true));
    dispatch(SchedularActions.setIsDiffModalOpen(false));
  };

  //   const isLoading = useSelector(
  //     SchedularSelectors.getIsSanityCheckScheduleLoading
  //   );
  const statusLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'scheduleSanityAndDeploy')
  );
  return (
    <>
      <FullPageLoader loading={statusLoading} />
      <DataWrapper>
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <BottomButtonWrapper>
            <div className="col-2 ">
              {' '}
              <Button
                size="md"
                variant="quaternary"
                type="button"
                onClick={handleSanityCheck}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <SanityCheckIcon height="24" width="24" />
                  Sanity Check
                </div>
              </Button>
            </div>
          </BottomButtonWrapper>
          {sanityCheckData?.data &&
            !isEmpty(sanityCheckData?.data) &&
            sanityCheckData?.data?.map(item => (
              <span key={item?.processGroupId}>
                <SanityCheckCollapsableItem item={item} />
              </span>
            ))}
        </ScrollSetGrey>
      </DataWrapper>
    </>
  );
};

export default DiffSanityCheck;
