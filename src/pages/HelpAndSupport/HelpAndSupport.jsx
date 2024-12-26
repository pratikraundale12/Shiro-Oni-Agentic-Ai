/* eslint-disable */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, PlusIcon, SmallSearchIcon } from '../../assets';
import { MinusIcon } from '../../assets/Icons/MinusIcon';
import dashboardDemoVideo from '../../assets/videos/DFMDashboardDemo.mp4';

import { Button } from '../../shared';
import { SettingsSelectors } from '../../store/settings';
import { theme } from '../../styles';
import clusterListImage from '../../assets/images/clusterList.png';
import editClusterImage from '../../assets/images/editCluster.png';
import scheduleListImage from '../../assets/images/scheduleList.png';
import scheduleDeploymentImage from '../../assets/images/scheduleDeployment.png';

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
  white-space: normal;
  svg {
    min-width: 16px;
  }
`;

const AccordionContent = styled.div`
  white-space: normal;
  padding: 0 1rem 1rem 1rem;
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
        'Data Flow Manager is a robust UI-based tool to streamline data flow management across Apache NiFi clusters. With the point-and-click interface, it simplifies the deployment & promotion of data flows from one cluster to another. Simply put, Data Flow Manager simplifies the transfer of NiFi workflows across environments, from developmentto production.',
    },
    {
      question: 'What is the purpose of Data Flow Manager?',
      answer:
        'Data Flow Manager is meticulously designed to simplify data flow management across NiFi clusters. Its purpose is to help NiFi admins and developers save significant time, improve operational efficiency, accelerate data operations, reduce manual errors, improve data quality, and optimize resource utilization.',
    },
    {
      question: 'What are the prerequisites to use Data Flow Manager?',
      answer: (
        <>
          To use Data Flow Manager, you need the following :
          <br />
          ● Running NiFi instances linked with a registry
          <br />
          ● EC2/virtual machine
          <br />
          ● SMTP server
          <br />
          ● LDAP
          <br />● A user with access to all clusters
        </>
      ),
    },
    {
      question:
        'Can I deploy Data Flow Manager as a SaaS solution or on-premises?',
      answer:
        'Data Flow Manager can be deployed on-premises, meaning that you can install andrun it within your own infrastructure. This way, you can have full control over the environment and data security.',
    },
    {
      question:
        'Can I customize the Data Flow Manager’s interface to fit my organization’s branding?',
      answer:
        "Yes, Data Flow Manager supports white labeling. You can customize its interface with your organization's branding, including logos, colors, and themes, for a seamless and personalized user experience.",
    },
    {
      question:
        'Does Data Flow Manager automatically locate/identify existing NiFi clusters or do I need to manually configure them?',
      answer: (
        <>
          Data Flow Manager does not automatically locate/identify existing NiFi
          clusters; you will need to configure them manually. To configure a
          cluster :
          <br />● Choose the option to add a new cluster. Under the “Clusters”
          tab, click the “Add new Cluster” button on the top-right corner.
          <br />
          <img src={clusterListImage} className="img-fluid" />
          <br />● Enter the cluster details, such as the Cluster Name, NiFi URL,
          and Cluster Tags. Mark the provided checkboxes if you agree to the
          statements. Choose an option to test your cluster.
          <br />● Enter the registry details. <br />● Continue.
        </>
      ),
    },
    {
      question:
        'How can I manage clusters for multiple teams working on different domains?',
      answer:
        'Data Flow Manager enables NiFi administrators to configure and manage access permissions to clusters effectively. This ensures that each team is granted access only to the clusters relevant to their specific domain, maintaining security and operational efficiency.',
    },
    {
      question:
        'Does Data Flow Manager support deploying data flows across clusters in multiple regions from a single interface?',
      answer:
        'Yes, Data Flow Manager allows you to deploy data flows across multiple NiFi clusters located in different regions. The only prerequisite is that all clusters from different regions must be added to the Data Flow Manager and assigned to different users.',
    },
    {
      question: ' Can I limit access to specific clusters for certain teams?',
      answer:
        'Yes. Data Flow Manager allows you to restrict cluster access by assigning roles and permissions to specific teams or users.',
    },
    {
      question:
        'Can I edit cluster details once I onboard it to the Data Flow Manager?',
      answer: (
        <>
          Yes, you can easily edit the cluster and registry details even after
          onboarding it to Data Flow Manager. To edit the cluster, first, you
          need to enable it by logging in with the correct credentials. From the
          vertical ellipsis menu, choose the edit option and make modifications
          to your cluster details.
          <br />
          <img
            src={editClusterImage}
            alt="Edit Cluster"
            className="img-fluid"
          />
        </>
      ),
    },
    {
      question: 'What does cluster status mean?',
      answer:
        'If the cluster status shows a green horizontal bar, it implies all nodes in that cluster are up. If you see a horizontal bar with red and green colors, this means that a few of the nodes in the cluster are down.',
    },
    {
      question: 'What different cluster details can I access?',
      answer:
        'Data Flow Manager helps you access the cluster name, cluster URL, registry name, registry URL, IP address, node ID, heartbeat, status, and event log. Also, you can track the number of total nodes and connected nodes in a cluster',
    },
    {
      question: 'What does activating and deactivating a cluster mean?',
      answer:
        'Deactivating a cluster refers to a soft delete. This action will remove the cluster from your list, but underlying data and configurations remain intact, ensuring no permanent loss of data. Activating a cluster will restore it to the cluster list',
    },
    {
      question: 'How can I deploy a particular process group?',
      answer: (
        <>
          To deploy a particular process group, first log in to the respective
          cluster. Under the Process Groups tab :
          <br />
          ● Click the Deploy button on the top-right corner.
          <br />
          ● Choose Bucket and Flow Name.
          <br />
          ● Decide whether or not to keep the existing Parameter Contexts.
          <br />● Select the flow version and continue.
        </>
      ),
    },
    {
      question: 'What happens when you upgrade a process group?',
      answer: (
        <>
          Consider that you have deployed version 1 of a specific process group.
          Let’s say you made changes to the process group and committed to the
          registry, which will create version 2 of the process group.
          <br />
          To deploy version 2, you can simply upgrade the process group. If you
          choose to deploy it, Data Flow Manager will create a new copy of the
          process group on the target cluster, leaving the original version
          unchanged.
        </>
      ),
    },
    {
      question: 'Can I start or stop the process group after I deploy it?',
      answer:
        'Yes, definitely. Data Flow Manager enables you to choose whether to start or stop the process group after deployment.',
    },
    {
      question: 'Can I view comments on different versions of the flow?',
      answer:
        'Yes, if you have added comments in the Registry, Data Flow Manager will automatically display them for each version of the flow, allowing you to easily track feedback and changes across versions.',
    },
    {
      question: 'How can I schedule the deployment of a process group?',
      answer: (
        <>
          Under the “Schedule Deployment” menu :
          <br />
          ● Click a button named “Schedule Deployment” on the top right corner.
          <br />
          <img src={scheduleListImage} alt="Schedule" className="img-fluid" />
          <br />
          ● Next, choose Bucket, Flow Name, and Version Control. Click Continue.
          <br />
          <img
            src={scheduleDeploymentImage}
            className="img-fluid"
            alt="Schedule Deployment"
          />
          <br />
          ● Set the canvas position for the process group and continue.
          <br />
          ● Now, set the desired deployment time and ensure to start the flow.
          <br />
          ● Edit the parameter context and variables and configure the required
          external controller services.
          <br />● Click Continue → Schedule.
        </>
      ),
    },
    {
      question: 'Will my process group get deployed at the scheduled time?',
      answer:
        'Yes, your process group will deploy at the scheduled time, provided it has received approval from the admin group.',
    },
    {
      question:
        'How will an admin get to know that a specific user has scheduled the deployment of a process group and is waiting for approval?',
      answer:
        "Admin users receive an email notification with all the relevant details about the scheduled deployment. The email includes a 'Click to Approve' button, making it easy for the admin to take action promptly. The admin has the authority either to approve or reject the deployment request and change the deployment time.",
    },
    {
      question:
        'What happens if the admin does not approve a scheduled process group deployment on time?',
      answer:
        'If the admin does not approve the deployment by the scheduled time, the deployment will not proceed. However, you can easily reschedule it for a later time as needed.',
    },
    {
      question: 'How can I track process groups scheduled for deployment?',
      answer:
        'Data Flow Manager includes a dedicated menu “Scheduled Deployment” that lists all process groups with scheduled deployments. You can view the key details like the process group, source and destination clusters, deployment time, approver, and status (Scheduled, In Progress, Not Approved, Pending, Canceled, & Success). Additionally, you can filter the process groups based on their status for quick access.',
    },
    {
      question:
        'Can I edit the parameter context and variables of a process group while scheduling it for deployment?',
      answer:
        'Yes, definitely. Once you choose your flow details and set the deployment time, you can edit parameter context and variables.',
    },
    {
      question:
        'Can I configure external controller services for a process group while scheduling it for deployment?',
      answer:
        'Yes, you can. After selecting the flow details and setting the deploying time, you can configure external controller services under the “Controller Services” tab.',
    },
    {
      question: 'Can I schedule the upgrade of a process group?',
      answer: (
        <>
          Yes. To schedule the upgrade of a process group :
          <br />
          ● Click on the calendar icon located on the right side of the process
          group.
          <br />
          ● Select the flow version and continue.
          <br />
          ● Set the date and time. Choose to start the flow, if needed.
          <br />
          ● Edit the parameter contexts and variables, if required.
          <br />
          ● Configure the required controller services.
          <br />
          ● Click Continue → Schedule Upgrade.
          <br />
          If you choose the flow version that is already deployed, Data Flow
          Manager will display the pop-up notifying the same.
        </>
      ),
    },
    {
      question: 'What is a process group?',
      answer:
        'A process group is a collection of NiFi processors, connections, FlowFiles, and other components that are used to manage and organize data flows.',
    },
    {
      question: 'Can I deploy custom processors?',
      answer:
        'Yes, you can deploy custom processors in Data Flow Manager. To do this, you need to manually add their binary files to the respective NiFi cluster where the processors will be used.',
    },
    {
      question: 'What different process group details can I obtain?',
      answer:
        'You can obtain essential details like the process group summary, flow control, parameter context, variables, controller service, and audit log.',
    },
    {
      question: 'What information is included in the process group summary?',
      answer:
        'The process group summary contains details like process group name, flow name, registry URL, NiFi URL, and version.',
    },
    {
      question: 'What details does the flow control provide?',
      answer:
        'The flow control provides details on the number of running, stopped, disabled, and invalid processors. It also provides the options to start and stop running the flow.',
    },
    {
      question: 'What different actions does the audit log capture?',
      answer:
        'For a particular process group, the audit log captures the event name, process group, flow name, cluster, message, version, status, timestamp, and the name of the person who created it.',
    },
    {
      question:
        'How can I attach an existing external controller service to a process group while promoting it?',
      answer: (
        <>
          While you deploy your process group, you first need to choose the
          bucket, canvas position, and flow version. In the next step, you’ll
          find the controller service tab.
          <br />
          ● Go to External Controller Services. You'll find all the controller
          services used by your flow.
          <br />
          ● Click Configure → select the controller service → Submit.
          <br />
          ● Now, go to Settings located on the right side of the chosen
          controller service.
          <br />
          ● Fill in the values of all the fields, and finally click Apply.
          <br />
          This is how you can attach an existing external controller service to
          a process group while promoting it.
        </>
      ),
    },
    {
      question:
        'How can I add a new external controller service to a process group while promoting it?',
      answer: (
        <>
          Under the controller services tab, go to External Controller Service
          where you can find all the controller services used by your flow. When
          you click on Configure, the screen pops up where you can find a button
          to add a new controller service.
          <br />
          Alternatively, when you attach an existing controller service to a
          process group, you find an option to re-configure it. Clicking it will
          pop up a screen, allowing you to add a new controller service.
        </>
      ),
    },
    {
      question:
        'How can I configure a controller service local to that process group while promoting?',
      answer:
        'Under the Controller Services tab, you’ll also find local controller services. To configure them, go to respective settings, edit the values of the required fields, and apply the changes.',
    },
    {
      question: 'Can I add or delete existing user roles?',
      answer:
        'If you are an admin, you can add new roles and delete existing roles with just a few clicks. Also, you can edit the roles..',
    },
    {
      question: 'What different cluster-level permissions are available?',
      answer:
        'Data Flow Manager offers three cluster-level permissions: View, Edit, and Delete. These permissions are managed by administrators to ensure appropriate access control and functionality.',
    },
    {
      question: 'Can I customize roles and permissions in Data Flow Manager?',
      answer:
        'Yes, you can customize roles according to your organization’s needs. You can create custom user roles. However, you cannot customize permissions.',
    },
    {
      question: 'Does Data Flow Manager provide a detailed activity history?',
      answer:
        'Yes, Data Flow Manager provides detailed activity history that tracks user actions on various entities, including the cluster, process group, registry, and controller service. It includes details such as the action performed on the entity, associated messages, timestamps, status, and the name of the user who performed it.',
    },
    {
      question:
        'I want to track activities associated only with process groups. Does Data Flow Manager provide the capability to filter the activity history?',
      answer: (
        <>
          Yes, absolutely! Data Flow Manager lets you filter the activity
          history based on 3 parameters, as follows:
          <br />● <strong>Entity:</strong> Filter activities by clusters,
          process groups, registries, controller services, and users.
          <br />● <strong>Event:</strong> Filter by actions, like add, delete,
          deploy, and upgrade.
          <br />● <strong>Status:</strong> Filter activities based on the
          event’s status - Success, Failed, or All.
        </>
      ),
    },
    {
      question: 'Who can access the activity history?',
      answer: 'Only administrators can access the activity history.',
    },
    {
      question: 'How frequently does LDAP auto-sync with Data Flow Manager?',
      answer:
        'Administrators have the flexibility to configure the LDAP auto-sync frequency in Data Flow Manager. This synchronization can be set to occur every 15 minutes, 30 minutes, 45 minutes, or 1 hour, based on your organization’s needs.',
    },
    {
      question:
        'Can I import multiple users from LDAP to Data Flow Manager simultaneously?',
      answer:
        'Yes, you have the flexibility to import multiple users or user groups from LDAP to Data Flow Manager at a time. Additionally, you can choose to import users one by one based on your operational requirements.',
    },
    {
      question: ' Can I track process group-level errors?',
      answer:
        'Yes, Data Flow Manager allows you to track process group-level errors through a dashboard. Each error includes detailed information such as the process group, processor ID, processor name, and error message, enabling efficient troubleshooting',
    },
  ];

  const videos = [
    {
      title: 'DFM Dashboard Demo?',
      video: dashboardDemoVideo,
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
