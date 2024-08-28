import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../shared';
import { PlusIcon, SmallSearchIcon } from '../../assets';
import { MinusIcon } from '../../assets/Icons/MinusIcon';
import dashboardErrorVideo from '../../assets/videos/DashboardError.mp4';
import dashboardFlowMetricsVideo from '../../assets/videos/DashboardFlowMetrics.mp4';
import dashboardQuickInsight from '../../assets/videos/DashboardQuickInsight.mp4';
import loginToDFMThroughAdmin from '../../assets/videos/LoginToDFMThroughAdmin.mp4';
import loginToDFMThroughUser from '../../assets/videos/LoginToDFMThroughUser.mp4';
import { theme } from '../../styles';

const Container = styled.div`
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;

const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
`;

const NavButton = styled.button`
  border: 0;
  background: none;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontNato};
  color: ${props =>
    props.active ? props.theme.colors.primary : props.theme.colors.darkGrey2};
  cursor: pointer;
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active &&
    `border-bottom: 1px solid ${props.theme.colors.primaryActive};`}
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  background-color: #f5f7fa;
  padding: 5px;
  position: sticky;
  bottom: 0;
`;

const FormContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 65px);
  min-height: 500px;
`;

const FAQHeading = styled.div`
  font-family: Noto Sans;
  font-size: 30px;
  font-weight: 700;
  line-height: 21.85px;
  text-align: left;
  margin-top: 30px;
`;

const AccordionItem = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid #b9c3d3;
`;

const AccordionButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 21.85px;
  text-align: left;
`;

const AccordionContent = styled.div`
  padding: 0 1rem;
  font-size: 16px;
  font-weight: 400;
  line-height: 23.41px;
  text-align: left;
`;

const StyledButton = styled(Button)`
  width: auto;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-right: 17px;
  padding-left: 17px;
  height: 55px;
  span {
    font-size: 18px;
  }
`;

const Title = styled.div`
  font-family: Red Hat Display;
  font-size: 20px;
  font-weight: 700;
  line-height: 22.06px;
  text-align: left;
  margin-bottom: 20px;
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
export const HelpAndSupport = () => {
  const [activeTab, setActiveTab] = useState('FAQs');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Data Flow Manager?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
    {
      question: 'What is the purpose of the DFM?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
    {
      question: 'What is namespace?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
    {
      question: ' How to manage namespace?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
    {
      question:
        'How DFM promote the namespace from one cluster to the another cluster?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
    {
      question: 'What is cluster and how do we suppose to login?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
    {
      question: ' What is the meaning of activate/deactive cluster?',
      answer:
        'Vitae congue eu consequat ac felis placerat vestibulum lectus mauris ultrices. Cursus sit amet dictum sit amet justo donec enim diam porttitor lacus luctus accumsan tortor posuere.',
    },
  ];

  const videos = [
    {
      title: 'How do I change my account email?',
      video: dashboardErrorVideo,
    },
    {
      title: 'How do I change my account email?',
      video: dashboardFlowMetricsVideo,
    },
    {
      title: 'How do I change my account email?',
      video: dashboardQuickInsight,
    },
    {
      title: 'How do I change my account email?',
      video: loginToDFMThroughAdmin,
    },
    {
      title: 'How do I change my account email?',
      video: loginToDFMThroughUser,
    },
  ];

  const toggleFaq = index => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Container>
        <NavTabs id="nav-tab" role="tablist">
          <NavButton
            active={activeTab === 'FAQs'}
            onClick={() => setActiveTab('FAQs')}
          >
            FAQs
          </NavButton>
          <NavButton
            active={activeTab === 'Videos'}
            onClick={() => setActiveTab('Videos')}
          >
            Videos
          </NavButton>
        </NavTabs>

        {activeTab === 'FAQs' && (
          <>
            <FormContainer>
              <div className="d-flex gap-5">
                <FAQHeading>Frequently Asked Questions</FAQHeading>
                <SearchContainer>
                  <SmallSearchIcon
                    width={18}
                    height={18}
                    color={theme.colors.darkGrey1}
                  />
                  <Search type="search" placeholder="search" />
                </SearchContainer>
              </div>

              <div className="row mt-5">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="col-6"
                    style={{ overflow: 'hidden' }}
                  >
                    <AccordionItem>
                      <AccordionButton onClick={() => toggleFaq(index)}>
                        <span
                          style={
                            openFaqIndex === index ? { color: 'orange' } : null
                          }
                        >
                          {faq.question}
                        </span>
                        <div>
                          {openFaqIndex === index ? (
                            <MinusIcon color="#000000" />
                          ) : (
                            <PlusIcon color="#000000" />
                          )}
                        </div>
                      </AccordionButton>
                      <div
                        style={{
                          height: openFaqIndex === index ? 'auto' : '0',
                          overflow: 'hidden',
                        }}
                      >
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </div>
                    </AccordionItem>
                  </div>
                ))}
              </div>
            </FormContainer>
          </>
        )}

        {activeTab === 'Videos' && (
          <FormContainer>
            <div className="d-flex gap-5">
              <FAQHeading>DFM videos</FAQHeading>
              <SearchContainer>
                <SmallSearchIcon
                  width={18}
                  height={18}
                  color={theme.colors.darkGrey1}
                />
                <Search type="search" placeholder="search" />
              </SearchContainer>
            </div>
            <div className="row mt-3">
              {videos.map((video, index) => (
                <div key={index} className="col-4 gap-2">
                  <video
                    width="100%"
                    controls
                    style={{
                      borderRadius: '10px',
                      marginBottom: '5px',
                      // marginRight: '20px',
                      paddingRight: '50px',
                    }}
                  >
                    <source src={video.video} type="video/mp4" />
                  </video>
                  <Title>How do I change my account email?</Title>
                </div>
              ))}
            </div>
          </FormContainer>
        )}
      </Container>
      <FlexWrapper>
        <div>
          <FAQHeading>Still have questions?</FAQHeading>
          <div style={{ marginTop: '15px' }}>
            We aim to respond to all inquiries within 24 hours. Please provide
            as much <br />
            detail as possible in your email to help us assist you more
            efficiently.
          </div>
        </div>
        <div>
          <StyledButton>Support@ksolves.com</StyledButton>
        </div>
      </FlexWrapper>
    </>
  );
};
