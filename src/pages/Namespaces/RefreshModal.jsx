import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import styled from 'styled-components';

const CollapsibleSectionMain = styled.div`
  margin-top: -1.5rem;
`;
const CollapsibleSection = styled.div`
  background: #fff;
  button {
    display: flex;
    align-items: center;
    gap: 6px;
    border: none;
    padding-left: 0px;
    font-weight: 600;
    &:focus,
    &:active {
      outline: none;
      border: none;
    }
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-left: 10px solid #000;
      border-bottom: 6px solid transparent;
      display: inline-block;
      vertical-align: middle;
    }
    &[aria-expanded='true'] {
      &::before {
        transform: rotate(90deg);
      }
    }
  }
  button[aria-expanded='true']:before {
  }
`;

const CountView = styled.span`
  color: var(--bs-gray-400);
`;
const ReferencinContent = styled.div`
  overflow: hidden;
`;
const Referencingbody = styled.div`
  margin-bottom: 1rem;
`;
const ReferencingbodyHeading = styled.div`
  font-size: 16px;
`;

const ReferencingbodyUl = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
`;
const ReferencingbodyLi = styled.li`
  list-style: none;
  color: var(--bs-gray-500);
`;

const RefreshModal = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const dispatch = useDispatch();
  const isModalOpen = useSelector(NamespacesSelectors.getRefreshmodalOpen);
  const handleClose = () => {
    dispatch(NamespacesActions.setRefreshmodalOpen(false));
  };
  const handleToggle = index => {
    // Toggle the current detail; if it's already open, close it; if it's closed, open it
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <>
      <Modal
        title=" Referencing Components"
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        size="md"
        // primaryButtonText={'Add'}
        // secondaryButtonText="Back"
        // contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
      >
        <CollapsibleSectionMain>
          <CollapsibleSection>
            <button
              onClick={() => handleToggle(0)}
              className="btn toggle-button"
              aria-expanded={openIndex === 0}
              aria-controls={`section-content-${0}`}
            >
              SQL Flow <CountView>(1)</CountView>
            </button>
            <ReferencinContent
              id={`section-content-${0}`}
              style={{
                maxHeight: openIndex === 0 ? '100%' : '0',
              }}
            >
              <Referencingbody>
                <ReferencingbodyHeading>
                  Referencing Processors
                </ReferencingbodyHeading>
                <ReferencingbodyUl>
                  <ReferencingbodyLi>None</ReferencingbodyLi>
                </ReferencingbodyUl>
              </Referencingbody>
              {/* Referencingbody / end */}
              <Referencingbody>
                <ReferencingbodyHeading>
                  Referencing Constroller Services
                </ReferencingbodyHeading>
                <ReferencingbodyUl>
                  <ReferencingbodyLi>list 1</ReferencingbodyLi>
                  <ReferencingbodyLi>list 1</ReferencingbodyLi>
                </ReferencingbodyUl>
              </Referencingbody>
              {/* Referencingbody / end */}
            </ReferencinContent>
            {/* ReferencinContent / end */}
          </CollapsibleSection>
          {/* CollapsibleSection / end */}
          <CollapsibleSection>
            <button
              onClick={() => handleToggle(1)}
              className="btn toggle-button"
              aria-expanded={openIndex === 1} // Accessibility: indicate the state of the section
              aria-controls={`section-content-${1}`} // Accessibility: link button to content
            >
              Click to See More Information (2)
            </button>
            <ReferencinContent
              id={`section-content-${1}`}
              style={{
                maxHeight: openIndex === 1 ? '200px' : '0',
              }}
            >
              <p>This is the content for the second section.</p>
            </ReferencinContent>
          </CollapsibleSection>
          {/* CollapsibleSection / end */}
        </CollapsibleSectionMain>
      </Modal>
    </>
  );
};

export default RefreshModal;
