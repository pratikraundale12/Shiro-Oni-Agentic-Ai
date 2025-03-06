/*eslint-disable*/
import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { Modal } from '../../../shared';
import { KDFM } from '../../../constants';
import { ManageClusterIcon } from '../../../assets';

const Container = styled.div``;
const BulletContainer = styled.div`
  height: 120px;
  margin-bottom: 10px;
  border: 2px solid red;
  border-radius: 14px;
  background-color: #f5f7fa;
`;
const IconContainer = styled.div`
  border: 1px solid red;
  border-radius: 14px;
  background-color: #ffff;
`;
const LeftHolder = styled.div`
  padding: 16px 26px;
`;
const RightHolder = styled.div`
  padding: 26px 26px;
`;
const HighLightText = styled.span`
  font-family: Noto Sans;
  font-weight: 600;
  font-size: 20px;
  line-height: 27.24px;
  letter-spacing: 0%;
  color: #444445;
`;
const BottomText = styled.span`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  line-height: 21.17px;
  letter-spacing: 0%;
  color: #444445;
`;
//display: ${props => (props.show ? 'block' : 'none')};
export const AddOrEditClusterModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    ClustersSelectors.getIsAddorEditClusterModalOpen
  );
  const onRequestClose = () => {
    dispatch(ClustersActions.setIsAddorEditClusterModalOpen(false));
  };
  const { handleSubmit } = useForm();

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleSubmit(onRequestClose)}
      //   onSubmit={handleSubmit(onRequestClose)}
      title={KDFM.NEW_CLUSTER}
      primaryButtonText="Continue"
      secondaryButtonText="Back"
      contentStyles={{ minWidth: '32%' }}
      footerAlign="start"
    >
      <Container>
        <BulletContainer>
          <div className="d-flex row align-items-center  h-100 mx-auto">
            <LeftHolder className="col-3 align-items-center justify-content-center h-100 ">
              <IconContainer className=" d-flex align-items-center justify-content-center h-100">
                <ManageClusterIcon height="50" width="50" color="black" />
              </IconContainer>
            </LeftHolder>
            <RightHolder className="col-9 h-100">
              <div className="col-11 h-100">
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <HighLightText>Create New Cluster</HighLightText>
                </div>
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <BottomText>Set up a new DFM cluster from scratch</BottomText>
                </div>
              </div>
            </RightHolder>
          </div>
        </BulletContainer>
        <BulletContainer></BulletContainer>
      </Container>
    </Modal>
  );
};

// AddOrEditClusterModal.propTypes = {
//   icon: PropTypes.elementType.isRequired,
//   primaryText: PropTypes.string,
//   secondaryText: PropTypes.string,
//   setValue: PropTypes.func.isRequired,
//   control: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
//   register: PropTypes.object.isRequired,
//   loadingButton: PropTypes.bool,
// };
