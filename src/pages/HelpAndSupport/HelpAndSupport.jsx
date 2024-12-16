import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, PlusIcon, SmallSearchIcon } from '../../assets';
import { MinusIcon } from '../../assets/Icons/MinusIcon';
import dashboardErrorVideo from '../../assets/videos/DashboardError.mp4';
import dashboardFlowMetricsVideo from '../../assets/videos/DashboardFlowMetrics.mp4';
import dashboardQuickInsight from '../../assets/videos/DashboardQuickInsight.mp4';
import loginToDFMThroughAdmin from '../../assets/videos/LoginToDFMThroughAdmin.mp4';
import loginToDFMThroughUser from '../../assets/videos/LoginToDFMThroughUser.mp4';
import { Button } from '../../shared';
import { SettingsSelectors } from '../../store/settings';
import { theme } from '../../styles';

const Container = styled.div`
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 0rem;
  height: 100%;
  overflow: auto;
  padding-bottom: 1rem;
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
  padding: 0.3rem 1rem 1rem 1rem;
  position: sticky;
  bottom: 0;
  border-radius: 10px;
`;

const FormContainer = styled.div`
  white-space: nowrap;
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
  margin-top: 1rem;
`;

const BottonHeading = styled.div`
  font-family: Noto Sans;
  font-size: 24px;
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
  line-height: 21.85px;
  text-align: left;
`;

const AccordionContent = styled.div`
  white-space: normal;
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
  margin-bottom: 30px;
  color: #444445;
`;
const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  @media screen and (min-width: 1400px) {
    max-width: 625px;
  }
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

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

export const HelpAndSupport = () => {
  const [activeTab, setActiveTab] = useState('FAQs');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mail = useSelector(SettingsSelectors.getSettings);
  const faqs = [
    {
      question: 'What is Data Flow Manager?',
      answer:
        'A Data Flow Manager is a tool that controls and monitors the movement and processing of data between systems or applications, ensuring efficient and accurate data handling.',
    },
    {
      question: 'What is the purpose of the DFM?',
      answer:
        'The purpose of the DFM (Design for Manufacturing) is to optimize the design of a product to make it easier and more cost-effective to manufacture. It focuses on simplifying the design, reducing production costs, and improving the overall efficiency of the manufacturing process.',
    },
    {
      question: 'What is process group?',
      answer:
        'A process group is a container that holds a set of identifiers (names) and allows them to be organized and distinguished from other identifiers. It helps avoid naming conflicts by providing a scope in which names can be defined and used, particularly in programming languages and XML.',
    },
    {
      question: 'How to manage process group?',
      answer:
        'Define Clear Names: Use descriptive names to avoid conflicts and make code more understandable.',
    },
    {
      question:
        'How DFM promote the process group from one cluster to another cluster?',
      answer:
        'DFM doesn’t directly promote process group between clusters. To do this, export the process group configuration from one cluster and import it into another using tools like kubectl or Helm charts.',
    },
    {
      question: 'What is cluster and how do we suppose to login?',
      answer:
        'A cluster is a group of interconnected servers or nodes that work together to provide a unified computing resource. To log in, use the cluster management interface or command-line tools, such as kubectl for Kubernetes clusters, often requiring authentication with credentials or tokens',
    },
    {
      question: 'What is the meaning of activate/deactivate cluster?',
      answer:
        'Activate a cluster means to enable it for use or bring it online, making it operational. Deactivate a cluster means to disable it or take it offline, making it unavailable for use.',
    },
    {
      question: 'How to activate/deactive the cluster?',
      answer:
        'Activate with help of button which is available in cluster list and deactivate after delteting',
    },
    {
      question: 'How to login to the cluster?',
      answer:
        'To log in to a Kubernetes cluster, use kubectl with a configured kubeconfig file. For cloud services, access the cluster through the provider’s console or CLI tools.',
    },
    {
      question: 'How can I see the nested process group?',
      answer:
        'Process group in Kubernetes are not inherently nested. To view process group, use kubectl get process group to list all process group in a flat structure.',
    },
    {
      question: 'What is flow matrix?',
      answer:
        'A flow matrix is a tool used to visualize and analyze the flow of processes, data, or tasks within a system. It helps in understanding the interactions and dependencies between different components or stages.',
    },
    {
      question: 'What is refresh rate how to control?',
      answer:
        'The refresh rate is the frequency at which data or content is updated or refreshed. It can be controlled by adjusting settings in the application or system configurations where the data is being displayed or monitored.',
    },
    {
      question: 'Can I change the logo of the application?',
      answer:
        'Yes, you can change the logo of an application by updating the logo file in the applications assets or configuration settings. Ensure the new logo is properly referenced in the applications code or settings.',
    },
    {
      question: ' How to switch among clusters?',
      answer:
        'To switch between Kubernetes clusters, use kubectl config use-context <context-name> to change the active context. For cloud services, use the providers CLI or management console to select the desired cluster.',
    },
  ];

  const videos = [
    {
      title: 'How to see the Dashboard Errors?',
      video: dashboardErrorVideo,
    },
    {
      title: 'What is the Flow Metrics?',
      video: dashboardFlowMetricsVideo,
    },
    {
      title: 'Dashbaord Quick Insight',
      video: dashboardQuickInsight,
    },
    {
      title: 'How to Login Through Admin?',
      video: loginToDFMThroughAdmin,
    },
    {
      title: 'How do Login Through User?',
      video: loginToDFMThroughUser,
    },
  ];

  const toggleFaq = index => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSearch = event => {
    const value = event.target.value.toLowerCase();
    if (value.length <= 100) {
      setSearchQuery(value);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery)
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <div className="d-flex flex-column h-100">
        <Container>
          <NavTabs id="nav-tab" role="tablist">
            <NavButton
              active={activeTab === 'FAQs'}
              onClick={() => setActiveTab('FAQs')}
            >
              FAQ&#39;s
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
                  <FAQHeading>Frequently Asked Questions?</FAQHeading>
                  <div className="w-100 d-flex justify-content-end">
                    <SearchContainer>
                      <SmallSearchIcon
                        width={18}
                        height={18}
                        color={theme.colors.darkGrey1}
                      />
                      <Search
                        type="search"
                        placeholder="Search Questions ...."
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </SearchContainer>
                  </div>
                </div>

                <div className="row mt-5">
                  {filteredFaqs.length > 0 ? (
                    <>
                      {/* First Column */}
                      <div className="col-6">
                        {filteredFaqs
                          .slice(0, Math.ceil(filteredFaqs.length / 2))
                          .map((faq, index) => (
                            <div key={index} style={{ overflow: 'hidden' }}>
                              <AccordionItem key={index}>
                                <AccordionButton
                                  onClick={() => toggleFaq(index)}
                                >
                                  <span
                                    style={
                                      openFaqIndex === index
                                        ? { color: 'orange' }
                                        : null
                                    }
                                  >
                                    {faq.question}
                                  </span>
                                  {openFaqIndex === index ? (
                                    <MinusIcon />
                                  ) : (
                                    <PlusIcon color="#000000" />
                                  )}
                                </AccordionButton>
                                {openFaqIndex === index && (
                                  <AccordionContent>
                                    {faq.answer}
                                  </AccordionContent>
                                )}
                              </AccordionItem>
                            </div>
                          ))}
                      </div>

                      {/* Second Column */}
                      <div className="col-6">
                        {filteredFaqs
                          .slice(Math.ceil(filteredFaqs.length / 2))
                          .map((faq, index) => (
                            <div key={index} style={{ overflow: 'hidden' }}>
                              <AccordionItem
                                key={index + Math.ceil(filteredFaqs.length / 2)}
                              >
                                <AccordionButton
                                  onClick={() =>
                                    toggleFaq(
                                      index + Math.ceil(filteredFaqs.length / 2)
                                    )
                                  }
                                >
                                  <span
                                    style={
                                      openFaqIndex ===
                                      index + Math.ceil(filteredFaqs.length / 2)
                                        ? { color: 'orange' }
                                        : null
                                    }
                                  >
                                    {faq.question}
                                  </span>
                                  {openFaqIndex ===
                                  index + Math.ceil(filteredFaqs.length / 2) ? (
                                    <MinusIcon />
                                  ) : (
                                    <PlusIcon color="#000000" />
                                  )}
                                </AccordionButton>
                                {openFaqIndex ===
                                  index +
                                    Math.ceil(filteredFaqs.length / 2) && (
                                  <AccordionContent>
                                    {faq.answer}
                                  </AccordionContent>
                                )}
                              </AccordionItem>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <NoDataIcon width={130} />
                      <NoDataText>No Data Found!!</NoDataText>
                    </>
                  )}
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
                  <Search
                    type="search"
                    placeholder="Search Video Tutorials ...."
                    value={searchQuery}
                    onChange={handleSearch}
                  />{' '}
                </SearchContainer>
              </div>
              <div className="row mt-3">
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video, index) => (
                    <div key={index} className="col-sm-6 col-lg-4 gap-2">
                      <video
                        width="100%"
                        controls
                        style={{
                          borderRadius: '10px',
                          marginBottom: '10px',
                          paddingRight: '50px',
                        }}
                      >
                        <source src={video.video} type="video/mp4" />
                        <track
                          kind="captions"
                          srcLang="en"
                          label="English captions"
                          src="/path/to/captions.vtt"
                          default
                        />
                      </video>
                      <Title>{video.title}</Title>
                    </div>
                  ))
                ) : (
                  <>
                    <NoDataIcon width={130} />
                    <NoDataText>No Data Found!!</NoDataText>
                  </>
                )}
              </div>
            </FormContainer>
          )}
        </Container>
        <FlexWrapper>
          <div>
            <BottonHeading>Still have questions?</BottonHeading>
            <div style={{ marginTop: '15px' }}>
              We aim to respond to all inquiries within 24 hours. Please provide
              as much <br />
              detail as possible in your email to help us assist you more
              efficiently.
            </div>
          </div>
          <div>
            <StyledButton
              onClick={() => (window.location.href = `mailto:${mail.email}`)}
            >
              {mail.email}
            </StyledButton>
          </div>
        </FlexWrapper>
      </div>
    </>
  );
};
