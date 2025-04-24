import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { NoDataIcon, RefreshIcon, SmallSearchIcon } from '../../assets';
import PineConeImage from '../../assets/images/PineCone.png';
import s3Image from '../../assets/images/s3logo.png';
import { history } from '../../helpers/history';
import {
  AiFlowGeneratorActions,
  AiFlowGeneratorSelectors,
} from '../../store/aiFlowGenerator';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import { NamespacesActions, NamespacesSelectors } from '../../store/namespaces';
import { theme } from '../../styles';
import { AddNewBucketModal } from '../AiFlowGenerator/AddNewBucketModal';
import { FlowAddToRegistryModal } from '../AiFlowGenerator/FlowAddToRegistryModal';
import { FlowAddedSuccessModal } from '../AiFlowGenerator/FlowAddedSuccessModal';
import FlowAlreadyExistModal from '../AiFlowGenerator/FlowAlreadyExistModal';

// Styled Components
const Container = styled.div`
  flex-grow: 1;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ContentArea = styled.main`
  padding: 1rem;
  flex-grow: 1;
  overflow: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
`;

const RefreshButton = styled.button`
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dde4f0;
  width: 37px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  min-width: 37px;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  width: 100%;

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

  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const GalleryContainer = styled.div`
  border: 1px solid #e2ccff;
  padding: 1rem;
  border-radius: 0.25rem;
  height: calc(100vh - 310px);
  overflow-y: auto;
`;

const GridRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12px;
`;

const GridColumn = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0 12px;

  @media (min-width: 1200px) {
    width: 50%;
    padding: 0 12px;
  }

  @media (min-width: 1400px) {
    width: 33.333%;
    padding: 0 12px;
  }
`;

const FlowCard = styled.div`
  padding: 1rem;
  height: 100%;
  position: relative;
  border-radius: 20px;
  background-color: #f5f7fa;
  ${props => (!props.isLastRow ? 'border-bottom: 1px solid #dee2e6;' : '')}
  ${props => (!props.isLastCol ? 'border-end: 1px solid #dee2e6;' : '')}
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const IconsContainer = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  padding: 10px;
  width: 56px;
  height: 56px;
  background-color: white;
  border-radius: 100%;
  margin-left: ${props => props.marginLeft || '0px'};
`;

const IconImage = styled.img`
  width: ${props => props.width || '20px'};
  height: ${props => props.height || '20px'};
`;

const VersionText = styled.div`
  font-family: Red Hat Display;
  font-weight: 500;
  font-size: 14px;
  color: #7a7a7a;
`;

const FlowTitle = styled.h3`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: #444445;
`;

const FlowDescription = styled.p`
  font-size: 14px;
  font-family: Red Hat Display;
  font-weight: 600;
  color: #7a7a7a;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background-color: #e3edf3;
  border: 1px solid #dde3f0;
  color: #7a7a7a;
  font-size: 14px;
  font-weight: 700;
  font-family: 'RED HAT DISPLAY';
`;

const AddButton = styled.button`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fd7e14;
  border: 1px solid #fd7e14;
  background-color: transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: auto;

  &:hover {
    background-color: #fff4ea;
  }
`;

const ButtonText = styled.span`
  font-size: 0.875rem;
`;

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fd7e14;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DataFlowInventory = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddToRegistryModal, setOpenAddToRegistryModal] = useState(false);
  const [isAddNewBucketModalOpen, setIsAddNewBucketModalOpen] = useState(false);
  const [isFlowAddedSuccessModalOpen, setIsFlowAddedSuccessModalOpen] =
    useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const itemsPerPage = 20;

  const bucketListData = useSelector(
    NamespacesSelectors.getBucketListDropDownData
  );
  const [buckets, setBuckets] = useState(bucketListData?.bucketList || []);
  const registryData = useSelector(AiFlowGeneratorSelectors.getRegistry);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const [registry, setRegistry] = useState(registryData);
  const isFlowAddedSuccessfully = useSelector(
    AiFlowGeneratorSelectors.getIsFlowAddedSuccessFully
  );
  const isFlowAlreadyAddedSuccessFully = useSelector(
    AiFlowGeneratorSelectors.getIsFlowAlreadyAddedSuccessFully
  );

  useEffect(() => {
    if (!isEmpty(bucketListData)) {
      setBuckets(bucketListData?.bucketList || []);
    }
  }, [bucketListData]);

  useEffect(() => {
    setRegistry(registryData);
  }, [registryData]);

  useEffect(() => {
    if (isFlowAddedSuccessfully) {
      setIsFlowAddedSuccessModalOpen(true);
    }
  }, [isFlowAddedSuccessfully]);

  useEffect(() => {
    dispatch(FlowValidationActions.fetchFlows());
    dispatch(AiFlowGeneratorActions.fetchRegistry());
  }, [dispatch]);
  useEffect(() => {
    setIsFlowAddedSuccessModalOpen(false);
    dispatch(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
  }, [dispatch]);

  const flows = useSelector(FlowValidationSelectors.getFlows);

  const handleSearch = e => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredFlows = flows.filter(
    flow =>
      (flow?.name?.toLowerCase() || '').includes(searchTerm) ||
      (flow?.comments?.toLowerCase() || '').includes(searchTerm) ||
      (flow?.tags?.join(' ')?.toLowerCase() || '').includes(searchTerm)
  );

  const handleScroll = useCallback(
    e => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      const totalPages = Math.ceil(filteredFlows.length / itemsPerPage);

      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        !isLoading &&
        currentPage < totalPages
      ) {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => {
          setCurrentPage(prevPage => prevPage + 1);
          setIsLoading(false);
        }, 500);
      }
    },
    [currentPage, filteredFlows.length, isLoading]
  );

  const paginatedFlows = filteredFlows.slice(0, currentPage * itemsPerPage);

  const onAddToRegistryClick = flow => {
    if (isEmpty(selectedCluster?.value)) {
      toast.warning('Please login to your cluster first');
      return;
    }
    setSelectedFlow(flow);
    if (!isEmpty(registry)) {
      dispatch(
        NamespacesActions.fetchRegistryData({
          registriesId: registry[0]?.id,
        })
      );
    }
    setOpenAddToRegistryModal(true);
  };

  const handleAddToRegistry = flowData => {
    const payload = {
      bucketId: flowData?.bucket,
      flowName: flowData?.flow_name,
      flowDesc: flowData?.flow_desc,
      flowJson: selectedFlow?.jsonData,
      isDataInventory: true,
    };
    dispatch(AiFlowGeneratorActions.addFlowToRegistry(payload));
    setOpenAddToRegistryModal(false);
  };

  const handleSuccessModalClose = () => {
    setIsFlowAddedSuccessModalOpen(false);
    dispatch(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
  };
  const handleSuccessModalSuccess = () => {
    setIsFlowAddedSuccessModalOpen(false);
    dispatch(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
    history.push('/process-group');
  };
  const hadleFlowAlreadyAdded = () => {
    dispatch(AiFlowGeneratorActions.setIsFlowAlreadyAddedSuccessFully(false));
    history.push('/process-group');
  };
  const handleAlreadyAddedModalClose = () => {
    setIsFlowAddedSuccessModalOpen(false);
    dispatch(AiFlowGeneratorActions.setIsFlowAlreadyAddedSuccessFully(false));
  };

  return (
    <Container>
      <MainContent>
        <ContentArea>
          {isEmpty(selectedCluster?.value) ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <NoDataIcon width={130} />
              <NoDataText>Please login to your cluster first</NoDataText>
            </div>
          ) : (
            <>
              <HeaderContainer>
                <Title>Flow Gallery List</Title>
                <RefreshButton
                  onClick={() => dispatch(FlowValidationActions.fetchFlows())}
                >
                  <RefreshIcon />
                </RefreshButton>
              </HeaderContainer>

              <SearchContainer>
                <SmallSearchIcon
                  width={18}
                  height={18}
                  color={theme.colors.darkGrey1}
                />
                <Search
                  type="search"
                  placeholder="Search by Title, Description"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </SearchContainer>

              <GalleryContainer onScroll={handleScroll}>
                {paginatedFlows.length === 0 ? (
                  <div className="d-flex flex-column align-items-center mt-5">
                    <NoDataIcon width={130} />
                    <NoDataText>No Data Found!!</NoDataText>
                  </div>
                ) : (
                  <>
                    <GridRow>
                      {paginatedFlows.map((flow, index) => {
                        // Calculate row and column position for border styling
                        const row = Math.floor(index / 3);
                        const col = index % 3;
                        const isLastRow =
                          row === Math.floor((paginatedFlows.length - 1) / 3);
                        const isLastCol =
                          col === 2 || index === paginatedFlows.length - 1;

                        return (
                          <GridColumn key={flow.id}>
                            <FlowCard
                              isLastRow={isLastRow}
                              isLastCol={isLastCol}
                            >
                              <CardHeader>
                                <IconsContainer>
                                  <IconWrapper>
                                    <IconImage
                                      src={s3Image}
                                      alt="S3"
                                      width="100%"
                                      height="auto"
                                    />
                                  </IconWrapper>
                                  <IconWrapper marginLeft="-18px">
                                    <IconImage
                                      src={PineConeImage}
                                      alt="Pinecone"
                                      width="100%"
                                      height="auto"
                                    />
                                  </IconWrapper>
                                </IconsContainer>
                                <VersionText>
                                  Version {flow?.version}
                                </VersionText>
                              </CardHeader>

                              <FlowTitle>{flow?.name}</FlowTitle>
                              <FlowDescription
                                data-tooltip-id={`tooltip-${flow?.id}`}
                                data-tooltip-content={flow?.comments}
                              >
                                {flow?.comments}
                              </FlowDescription>
                              <ReactTooltip
                                id={`tooltip-${flow?.id}`}
                                place="right"
                                style={{
                                  whiteSpace: 'normal',
                                  zIndex: 9999,
                                  maxWidth: '300px',
                                  backgroundColor: '#333',
                                  color: '#fff',
                                  padding: '8px',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                }}
                              />

                              <TagsContainer>
                                {(flow?.tags || [])
                                  .slice(0, 2)
                                  .map((tag, idx) => (
                                    <Tag key={idx}>{tag}</Tag>
                                  ))}

                                {flow?.tags?.length > 2 && (
                                  <Tag>+{(flow.tags || []).length - 2}</Tag>
                                )}
                              </TagsContainer>

                              <AddButton
                                onClick={() => {
                                  onAddToRegistryClick(flow);
                                }}
                              >
                                <ButtonText>Add to Registry</ButtonText>
                              </AddButton>
                            </FlowCard>
                          </GridColumn>
                        );
                      })}
                    </GridRow>
                    {isLoading && (
                      <LoadingContainer>
                        <LoadingSpinner />
                      </LoadingContainer>
                    )}
                  </>
                )}
              </GalleryContainer>
            </>
          )}
        </ContentArea>
      </MainContent>
      {openAddToRegistryModal && (
        <FlowAddToRegistryModal
          isModalOpen={openAddToRegistryModal}
          setIsModalOpen={setOpenAddToRegistryModal}
          bucketList={buckets || []}
          defaultFlowName={selectedFlow?.name || 'Flow'}
          handleAddToRegistry={handleAddToRegistry}
          handleClose={() => {
            setOpenAddToRegistryModal(false);
          }}
          setIsAddNewBucketModalOpen={setIsAddNewBucketModalOpen}
          refresh={() => {
            dispatch(FlowValidationActions.fetchFlows());
          }}
          setIsFlowAddedSuccessModalOpen={setIsFlowAddedSuccessModalOpen}
        />
      )}
      {isAddNewBucketModalOpen && (
        <AddNewBucketModal
          isModalOpen={isAddNewBucketModalOpen}
          setIsModalOpen={setIsAddNewBucketModalOpen}
          isDataInventory={true}
        />
      )}
      {isFlowAddedSuccessModalOpen && (
        <FlowAddedSuccessModal
          isModalOpen={isFlowAddedSuccessModalOpen}
          handleClose={handleSuccessModalClose}
          handleSubmit={handleSuccessModalSuccess}
        />
      )}
      <FlowAlreadyExistModal
        isModalOpen={isFlowAlreadyAddedSuccessFully}
        handleClose={handleAlreadyAddedModalClose}
        handleSubmit={hadleFlowAlreadyAdded}
      />
    </Container>
  );
};

export default DataFlowInventory;
