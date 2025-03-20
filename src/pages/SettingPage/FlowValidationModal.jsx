import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

import { InputField, Modal } from '../../shared';
import { MailIcon } from '../../assets';
import styled from 'styled-components';

const ModelRightSide = styled.div`
  height: 100%;
  border-radius: 12px;
  border: 1px solid #e0d3d3;
  background-color: #fbfcff;
  .list-group {
    border-radius: 12px;
    .list-group-item {
      background-color: #f5f7fa;
      color: #444445;
      padding-top: 0.6rem;
      padding-bottom: 0.6rem;
      &.active {
        background-color: #e9eff9;
        color: #444445;
        border: var(--bs-list-group-border-width) solid
          var(--bs-list-group-border-color);
      }
    }
  }
  .form-check-input {
    width: 20px;
    height: 20px;
    border-color: #292d32;
    background-color: transparent;
    margin: 0;
  }
  .form-check-input:checked {
    background-color: #ff7a00;
    border-color: #ff7a00;
  }
  .form-check-input: checked[type=radio] {
    --bs-form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
    background-size: 16px;
  }
`;

const FlowValidationModal = () => {
  const dispatch = useDispatch();

  // ✅ Correct way to get state from Redux
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getFlowValidationModal
  );

  const isClosedFlowValidationModal = () =>
    dispatch(SettingsActions.flowValidationModalOpen(false));

  return (
    <Modal
      title="Add Controller Service"
      isOpen={isFlowValidationModalOpen}
      onRequestClose={isClosedFlowValidationModal}
      size="md"
      primaryButtonText="Add"
      secondaryButtonText="Back"
      contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
    >
      <div className="row">
        <div className="col-md-8">
          <InputField
            name="email"
            icon={<MailIcon />}
            label="Rule Name"
            placeholder="Processor Colors"
          />
          <InputField
            name="email"
            icon={<MailIcon />}
            label="Rule Comments"
            placeholder="Rules for Processor Colors"
          />
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <InputField
                name="email"
                icon={<MailIcon />}
                placeholder="Rules for Processor Colors"
              />
            </div>
            <div className="col-md">
              <InputField
                name="email"
                icon={<MailIcon />}
                placeholder="Rules for Processor Colors"
              />
            </div>
            <div className="col-md-3">
              <InputField
                name="email"
                icon={<MailIcon />}
                placeholder="Rules for Processor Colors"
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary px-3 mb-3">+</button>
            </div>
          </div>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <InputField
                name="email"
                icon={<MailIcon />}
                placeholder="Rules for Processor Colors"
              />
            </div>
            <div className="col-md">
              <InputField
                name="email"
                icon={<MailIcon />}
                placeholder="Rules for Processor Colors"
              />
            </div>
            <div className="col-md-3">
              <InputField
                name="email"
                icon={<MailIcon />}
                placeholder="Rules for Processor Colors"
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary px-3 mb-3">+</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <ModelRightSide className="p-3">
            <div className="d-flex justify-content-between mb-3">
              <span className="d-flex align-items-center gap-2">
                Rules
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.00016 14.667C4.32683 14.667 1.3335 11.6737 1.3335 8.00033C1.3335 4.32699 4.32683 1.33366 8.00016 1.33366C11.6735 1.33366 14.6668 4.32699 14.6668 8.00033C14.6668 11.6737 11.6735 14.667 8.00016 14.667ZM7.50016 10.667C7.50016 10.9403 7.72683 11.167 8.00016 11.167C8.2735 11.167 8.50016 10.9403 8.50016 10.667V7.33366C8.50016 7.06033 8.2735 6.83366 8.00016 6.83366C7.72683 6.83366 7.50016 7.06033 7.50016 7.33366V10.667ZM8.6135 5.08033C8.58016 4.99366 8.5335 4.92699 8.4735 4.86033C8.40683 4.80033 8.3335 4.75366 8.2535 4.72033C8.1735 4.68699 8.08683 4.66699 8.00016 4.66699C7.9135 4.66699 7.82683 4.68699 7.74683 4.72033C7.66683 4.75366 7.5935 4.80033 7.52683 4.86033C7.46683 4.92699 7.42016 4.99366 7.38683 5.08033C7.3535 5.16033 7.3335 5.24699 7.3335 5.33366C7.3335 5.42033 7.3535 5.50699 7.38683 5.58699C7.42016 5.66699 7.46683 5.74032 7.52683 5.80699C7.5935 5.86699 7.66683 5.91366 7.74683 5.94699C7.90683 6.01366 8.0935 6.01366 8.2535 5.94699C8.3335 5.91366 8.40683 5.86699 8.4735 5.80699C8.5335 5.74032 8.58016 5.66699 8.6135 5.58699C8.64683 5.50699 8.66683 5.42033 8.66683 5.33366C8.66683 5.24699 8.64683 5.16033 8.6135 5.08033Z"
                    fill="#73737F"
                  />
                </svg>
              </span>
              <span>Add New Rule</span>
            </div>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center active">
                <div className="d-flex align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDisabled"
                    id="flexRadioDisabled"
                  />
                  Processor Colors
                </div>
                <span>Delete</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex  align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDisabled"
                    id="flexRadioDisabled"
                  />
                  Unknown Colors
                </div>
                <span>Delete</span>
              </li>
            </ul>
          </ModelRightSide>
        </div>
      </div>
    </Modal>
  );
};

export default FlowValidationModal;
