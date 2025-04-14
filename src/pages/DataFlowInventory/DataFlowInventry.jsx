import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, RefreshIcon, SmallSearchIcon } from '../../assets';
import PineConeImage from '../../assets/images/PineCone.png';
import s3Image from '../../assets/images/s3logo.png';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import { theme } from '../../styles';

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
  border: none;
  background: transparent;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
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

const DataFlowInventory = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(FlowValidationActions.fetchFlows());
  }, [dispatch]);

  const flows = useSelector(FlowValidationSelectors.getFlows);

  const handleSearch = e => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredFlows = flows.filter(flow =>
    flow.title.toLowerCase().includes(searchTerm)
  );

  return (
    <Container>
      <MainContent>
        <ContentArea>
          <HeaderContainer>
            <Title>Flow Gallery List</Title>
            <RefreshButton>
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
              placeholder="Search by title"
              onChange={handleSearch}
              value={searchTerm}
            />
          </SearchContainer>

          <GalleryContainer>
            {filteredFlows.length === 0 ? (
              <div className="d-flex flex-column align-items-center mt-5">
                <NoDataIcon width={130} />
                <NoDataText>No Data Found!!</NoDataText>
              </div>
            ) : (
              <GridRow>
                {filteredFlows.map((flow, index) => {
                  // Calculate row and column position for border styling
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  const isLastRow =
                    row === Math.floor((filteredFlows.length - 1) / 3);
                  const isLastCol =
                    col === 2 || index === filteredFlows.length - 1;

                  return (
                    <GridColumn key={flow.id}>
                      <FlowCard isLastRow={isLastRow} isLastCol={isLastCol}>
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
                          <VersionText>Version {flow.version}</VersionText>
                        </CardHeader>

                        <FlowTitle>{flow.title}</FlowTitle>
                        <FlowDescription>{flow.description}</FlowDescription>

                        <TagsContainer>
                          {flow.tags.slice(0, 2).map((tag, idx) => (
                            <Tag key={idx}>{tag}</Tag>
                          ))}

                          {flow.tags.length > 2 && (
                            <Tag>+{flow.tags.length - 2}</Tag>
                          )}
                        </TagsContainer>

                        <AddButton>
                          <ButtonText>Add to Registry</ButtonText>
                        </AddButton>
                      </FlowCard>
                    </GridColumn>
                  );
                })}
              </GridRow>
            )}
          </GalleryContainer>
        </ContentArea>
      </MainContent>
    </Container>
  );
};

export default DataFlowInventory;
