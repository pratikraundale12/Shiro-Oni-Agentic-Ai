/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Modal } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { Table } from '../../components';
import styled from 'styled-components';
import { theme } from '../../styles';
import { CrossIcon, SmallSearchIcon } from '../../assets';

const TextDisplay = styled.div`
  cursor: pointer;
`;

const FloatingAlertBox = styled.div`
  border: 3px solid ${theme.colors.primary};
  border-radius: 8px;
  //   background-color: #efefa0;
  font-weight: 600;
  top: 25px;
  left: 271px;
  /* width: calc(100vw - 712px) !important; */
  padding: 16px;

  @media screen and (max-width: 991px) {
    left: 100px;
    width: calc(100vw - 130px) !important;
  }
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AlertText = styled.span`
  color: ${theme.colors.primary};
  // Additional styles can be added here if needed
`;

const Container = styled.div`
  //   width: calc(100% - 373px);
  display: flex;
  justify-content: center;
  //   align-items: center;
`;

const IconContainer = styled.div`
  margin-left: 16px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;
const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
`;

const AddControllerServiceModal = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const modalOpenState = useSelector(
    NamespacesSelectors.getIsAddControllerServiceMOdalOpen
  );
  const controllerAddList = useSelector(
    NamespacesSelectors.getAddControllerServiceList
  );

  const closeModal = () => {
    dispatch(NamespacesActions.setIsAddControllerServiceModal(false));
  };

  useEffect(() => {
    if (modalOpenState) {
      dispatch(NamespacesActions.getAllControllerServiceListToAdd());
      setSelectedItem({});
    }
  }, [modalOpenState]);

  const truncateWithEllipsis = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const COLUMNS = [
    {
      label: 'Type',
      renderCell: item => (
        <TextDisplay onClick={() => setSelectedItem(item)}>
          {item?.name}
        </TextDisplay>
      ),
      width: '35%',
    },
    {
      label: 'Version',
      renderCell: item => (
        <TextDisplay onClick={() => setSelectedItem(item)}>
          {item?.bundle?.version}
        </TextDisplay>
      ),
      width: '15%',
    },
    {
      label: 'Tags',
      renderCell: item => (
        <TextDisplay onClick={() => setSelectedItem(item)}>
          {truncateWithEllipsis(item?.tags.join(', '), 70)}
        </TextDisplay>
      ),
      width: '50%',
    },
  ];
  const filteredModulesData = controllerAddList.filter(module =>
    module.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    const { name, type, bundle } = selectedItem;
    dispatch(
      NamespacesActions.addControllerServiceRootLevel({ name, type, bundle })
    );
    closeModal();
    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList());
    }, 500);
  };
  return (
    <>
      <Modal
        title="Add Controller Service"
        isOpen={modalOpenState}
        onRequestClose={closeModal}
        size="md"
        primaryButtonText={'Add'}
        secondaryButtonText="Back"
        // onSecondarySubmit={closeModal}
        onSubmit={() => handleSubmit()}
        contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
        primaryButtonDisabled={!selectedItem?.name}
      >
        <SearchContainer>
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="search"
            value={search}
            placeholder="Search Controller Service"
            onChange={e => setSearch(e.target.value)}
          />
        </SearchContainer>

        <div style={{ height: selectedItem?.name ? '300px' : '500px' }}>
          <Table data={filteredModulesData || []} columns={COLUMNS} />
        </div>

        {selectedItem?.name && (
          <Container>
            <FloatingAlertBox>
              <AlertContent>
                {selectedItem?.name}
                &nbsp; &nbsp;
                {selectedItem?.bundle?.version}
                <AlertText>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  {selectedItem?.bundle?.group} -{' '}
                  {selectedItem?.bundle?.artifact}
                </AlertText>
                <IconContainer onClick={() => setSelectedItem({})}>
                  <CrossIcon width={24} height={24} />
                </IconContainer>
              </AlertContent>
            </FloatingAlertBox>
          </Container>
        )}
        {selectedItem?.name && (
          <div className="d-flex justify-content-center">
            <div className="p-4 col-10 d-flex justify-content-center ">
              {selectedItem?.description}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default AddControllerServiceModal;
