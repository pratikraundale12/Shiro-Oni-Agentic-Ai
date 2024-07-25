import React from 'react';
import styled from 'styled-components';

import { Dropdown } from '../../shared';
import { FlowMetricsChart } from '../../components/Dashboard';
import { InsightContainer } from '../../components/Dashboard/InsightContainer';
import {
  ActiveThreadIcon,
  DisabledProcessorIcon,
  FlowFiledQuedIcon,
  FlowMetricHeaderIcon,
  LensIcon,
  RunnigProcessorIcon,
  StoppedProcessorIcon,
  TotalProcessorIcon,
  TotalQuedIcon,
  InvalidProcessorIcon,
} from '../../assets';

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const QuickInsightHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Continer = styled.div`
  height: calc(100vh - 78px);
  width: calc(100vw - 250px);
  overflow: hidden;
  padding: 20px 50px 22px 20px;
`;

const QuickInsightHeadingText = styled.h4`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  padding-botton: 5px;
`;

const InsightIconContiner = styled.div`
  padding-top: 5px;
`;

const BottomSectionScroll = styled.div`
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  overflow-x: hidden;
`;

const InsightDataContiner = styled.div`
  margin: 25px 0;
  display: flex;
  flex-wrap: wrap;
  row-gap: 25px;
`;

const FlowMetricHeader = styled.div`
  background-color: #f5f7fa;
  padding: 10px 11px;
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 25px;
  display: flex;
`;

const HeaderText = styled.p`
  margin-left: 10px;
`;
const DropdownHolder = styled.div`
  display: flex;
  align-items: center;
`;
const GraphContainer = styled.div`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 25px;
  margin-bottom: 10px;
`;
export const Dashboard = () => {
  const OptionsArray = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
    { value: 'option6', label: 'Option 6' },
    { value: 'option7', label: 'Option 7' },
    { value: 'option8', label: 'Option 8' },
    { value: 'option9', label: 'Option 9' },
    { value: 'option10', label: 'Option 10' },
  ];
  return (
    <Continer>
      <TopSection>
        <QuickInsightHeading>
          <InsightIconContiner>
            <LensIcon />
          </InsightIconContiner>
          <QuickInsightHeadingText>Quick Insight</QuickInsightHeadingText>
        </QuickInsightHeading>
        <DropdownHolder>
          <div>
            <Dropdown
              options={OptionsArray}
              placeholder="Select Cluster"
              label="Select Cluster"
            />
          </div>

          <div>
            <Dropdown
              options={OptionsArray}
              placeholder="Select Namespace"
              label="Select Namespace"
            />
          </div>
          <Dropdown
            options={OptionsArray}
            placeholder="Refresh"
            label="Refresh"
          />
        </DropdownHolder>
      </TopSection>
      <BottomSectionScroll>
        <InsightDataContiner>
          <InsightContainer
            backgroundCss="#F1F5FF"
            icon={TotalProcessorIcon}
            count={2604}
            text="Total Processor"
          />
          <InsightContainer
            backgroundCss="#FEFBEC"
            icon={RunnigProcessorIcon}
            count={24}
            text="Running Processor"
          />

          <InsightContainer
            backgroundCss="#EEF9FB"
            icon={StoppedProcessorIcon}
            count={240}
            text="Stopped Processor"
          />
          <InsightContainer
            backgroundCss="#FDF3FC"
            icon={DisabledProcessorIcon}
            count={126}
            text="Disabled Processor"
          />
          <InsightContainer
            backgroundCss="#FFF7ED"
            icon={InvalidProcessorIcon}
            count={26}
            text="Invalid Processor"
          />
          <InsightContainer
            backgroundCss="#F0F0F2"
            icon={ActiveThreadIcon}
            count={260}
            text="Active Thread"
          />
          <InsightContainer
            backgroundCss="#EEF8FF"
            icon={TotalQuedIcon}
            count={'11 Mb'}
            text="Total Queued"
          />
          <InsightContainer
            backgroundCss="#EEF0F4"
            icon={FlowFiledQuedIcon}
            count={26}
            text="Flow Files Queued"
          />
        </InsightDataContiner>
        <GraphContainer>
          <FlowMetricHeader>
            <FlowMetricHeaderIcon />
            <HeaderText>Flow Metrics</HeaderText>
          </FlowMetricHeader>
          <div>
            <FlowMetricsChart />
          </div>
        </GraphContainer>
        {/* table with bootstrap starts */}
        <div className="dashboard-table">
          <div className="d-flex align-items-center head-title-container">
            <svg
              width={20}
              height={18}
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99993 4.96973C9.18498 4.96973 8.52002 5.49969 8.52002 6.18465L9.04249 11.7593C9.04249 12.2868 9.47246 12.7167 9.99993 12.7167C10.5274 12.7167 10.9574 12.2868 10.9549 11.7893L11.4798 6.15465C11.4798 5.49969 10.8149 4.96973 9.99993 4.96973ZM10.3049 11.7568C10.3049 11.9243 10.1674 12.0618 9.99993 12.0618C9.83244 12.0618 9.69495 11.9243 9.69245 11.7268L9.16998 6.15215C9.16998 5.86717 9.55745 5.61969 9.99993 5.61969C10.4424 5.61969 10.8299 5.86967 10.8299 6.12215L10.3049 11.7568Z"
                fill="#C52B2B"
              />
              <path
                d="M9.99995 13.0566C9.38999 13.0566 8.89502 13.5516 8.89502 14.1616C8.89502 14.7715 9.38999 15.2665 9.99995 15.2665C10.6099 15.2665 11.1049 14.7715 11.1049 14.1616C11.1049 13.5516 10.6099 13.0566 9.99995 13.0566ZM9.99995 14.614C9.74997 14.614 9.54498 14.4116 9.54498 14.1591C9.54498 13.9091 9.74747 13.7041 9.99995 13.7041C10.2524 13.7041 10.4549 13.9066 10.4549 14.1591C10.4549 14.4116 10.2499 14.614 9.99995 14.614Z"
                fill="#C52B2B"
              />
              <path
                d="M11.4199 0.819949C11.1224 0.307481 10.5925 0 10 0C9.40754 0 8.87507 0.307481 8.58009 0.819949L0.223111 15.294C-0.0743704 15.8065 -0.0743704 16.4215 0.223111 16.9339C0.520593 17.4464 1.05056 17.7539 1.64302 17.7539H18.357C18.9494 17.7539 19.4819 17.4464 19.7769 16.9339C20.0744 16.4215 20.0744 15.8065 19.7769 15.294L11.4199 0.819949ZM19.2144 16.609C19.0369 16.9189 18.7145 17.1039 18.357 17.1039H1.64302C1.28554 17.1039 0.965565 16.9189 0.785576 16.609C0.605587 16.299 0.605587 15.929 0.785576 15.619L9.14255 1.14493C9.32004 0.834948 9.64252 0.64996 10 0.64996C10.3575 0.64996 10.6775 0.834948 10.8574 1.14493L19.2144 15.619C19.3919 15.929 19.3919 16.299 19.2144 16.609Z"
                fill="#C52B2B"
              />
            </svg>
            <p className="mb-0">Errors</p>
          </div>
          <div className="dashboard-container-table">
            <table className="w-100">
              <thead className="w-100">
                <tr>
                  <th>Process Group</th>
                  <th>Processor ID</th>
                  <th>Processor Name</th>
                  <th>Error Message</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Process group 1</td>
                  <td>0123666-44455-5887 HGK-45 HFT DERT</td>
                  <td>Cloud Server 1 North</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx={12}
                          cy={12}
                          r={9}
                          fill="#DD0426"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M9 14.9995L15 8.99951"
                          stroke="white"
                          strokeWidth="1.2"
                        />
                        <path d="M15 15L9 9" stroke="white" strokeWidth="1.2" />
                      </svg>
                      <div className="flex-column d-flex align-items-start ms-1">
                        <span>
                          <strong>Error Code:</strong> 404 - File Not Found
                        </span>
                        <span>
                          Description: The requested resource could not be found
                          on the server.
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-icons d-flex align-items-center justify-content-center">
                      <div className="copy-btn-icon">
                        <div className="cursor-pointer">
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.83317 4.99984V2.49984C5.83317 2.0396 6.20627 1.6665 6.6665 1.6665H16.6665C17.1267 1.6665 17.4998 2.0396 17.4998 2.49984V14.1665C17.4998 14.6268 17.1267 14.9998 16.6665 14.9998H14.1665V17.4991C14.1665 17.9598 13.7916 18.3332 13.3275 18.3332H3.33888C2.87549 18.3332 2.5 17.9627 2.5 17.4991L2.50217 5.8339C2.50225 5.37326 2.8772 4.99984 3.34118 4.99984H5.83317ZM4.16868 6.6665L4.16682 16.6665H12.4998V6.6665H4.16868ZM7.49983 4.99984H14.1665V13.3332H15.8332V3.33317H7.49983V4.99984Z"
                              fill="#444445"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 15L12 9L18 15"
                            stroke="#444445"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Process group 1</td>
                  <td>0123666-44455-5887 HGK-45 HFT DERT</td>
                  <td>Cloud Server 1 North</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx={12}
                          cy={12}
                          r={9}
                          fill="#DD0426"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M9 14.9995L15 8.99951"
                          stroke="white"
                          strokeWidth="1.2"
                        />
                        <path d="M15 15L9 9" stroke="white" strokeWidth="1.2" />
                      </svg>
                      <div className="flex-column d-flex align-items-start ms-1">
                        <span>
                          <strong>Error Code:</strong> 404 - File Not Found
                        </span>
                        <span>
                          Description: The requested resource could not be found
                          on the server.
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-icons d-flex align-items-center justify-content-center">
                      <div className="copy-btn-icon">
                        <div className="cursor-pointer d-none">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="#444445"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="#444445"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Process group 1</td>
                  <td>0123666-44455-5887 HGK-45 HFT DERT</td>
                  <td>Cloud Server 1 North</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx={12}
                          cy={12}
                          r={9}
                          fill="#DD0426"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M9 14.9995L15 8.99951"
                          stroke="white"
                          strokeWidth="1.2"
                        />
                        <path d="M15 15L9 9" stroke="white" strokeWidth="1.2" />
                      </svg>
                      <div className="flex-column d-flex align-items-start ms-1">
                        <span>
                          <strong>Error Code:</strong> 404 - File Not Found
                        </span>
                        <span>
                          Description: The requested resource could not be found
                          on the server.
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-icons d-flex align-items-center justify-content-center">
                      <div className="copy-btn-icon">
                        <div className="cursor-pointer">
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.83317 4.99984V2.49984C5.83317 2.0396 6.20627 1.6665 6.6665 1.6665H16.6665C17.1267 1.6665 17.4998 2.0396 17.4998 2.49984V14.1665C17.4998 14.6268 17.1267 14.9998 16.6665 14.9998H14.1665V17.4991C14.1665 17.9598 13.7916 18.3332 13.3275 18.3332H3.33888C2.87549 18.3332 2.5 17.9627 2.5 17.4991L2.50217 5.8339C2.50225 5.37326 2.8772 4.99984 3.34118 4.99984H5.83317ZM4.16868 6.6665L4.16682 16.6665H12.4998V6.6665H4.16868ZM7.49983 4.99984H14.1665V13.3332H15.8332V3.33317H7.49983V4.99984Z"
                              fill="#444445"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 15L12 9L18 15"
                            stroke="#444445"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Process group 1</td>
                  <td>0123666-44455-5887 HGK-45 HFT DERT</td>
                  <td>Cloud Server 1 North</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx={12}
                          cy={12}
                          r={9}
                          fill="#DD0426"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M9 14.9995L15 8.99951"
                          stroke="white"
                          strokeWidth="1.2"
                        />
                        <path d="M15 15L9 9" stroke="white" strokeWidth="1.2" />
                      </svg>
                      <div className="flex-column d-flex align-items-start ms-1">
                        <span>
                          <strong>Error Code:</strong> 404 - File Not Found
                        </span>
                        <span>
                          Description: The requested resource could not be found
                          on the server.
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-icons d-flex align-items-center justify-content-center">
                      <div className="copy-btn-icon">
                        <div className="cursor-pointer">
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.83317 4.99984V2.49984C5.83317 2.0396 6.20627 1.6665 6.6665 1.6665H16.6665C17.1267 1.6665 17.4998 2.0396 17.4998 2.49984V14.1665C17.4998 14.6268 17.1267 14.9998 16.6665 14.9998H14.1665V17.4991C14.1665 17.9598 13.7916 18.3332 13.3275 18.3332H3.33888C2.87549 18.3332 2.5 17.9627 2.5 17.4991L2.50217 5.8339C2.50225 5.37326 2.8772 4.99984 3.34118 4.99984H5.83317ZM4.16868 6.6665L4.16682 16.6665H12.4998V6.6665H4.16868ZM7.49983 4.99984H14.1665V13.3332H15.8332V3.33317H7.49983V4.99984Z"
                              fill="#444445"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 15L12 9L18 15"
                            stroke="#444445"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Process group 1</td>
                  <td>0123666-44455-5887 HGK-45 HFT DERT</td>
                  <td>Cloud Server 1 North</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx={12}
                          cy={12}
                          r={9}
                          fill="#DD0426"
                          fillOpacity="0.25"
                        />
                        <path
                          d="M9 14.9995L15 8.99951"
                          stroke="white"
                          strokeWidth="1.2"
                        />
                        <path d="M15 15L9 9" stroke="white" strokeWidth="1.2" />
                      </svg>
                      <div className="flex-column d-flex align-items-start ms-1">
                        <span>
                          <strong>Error Code:</strong> 404 - File Not Found
                        </span>
                        <span>
                          Description: The requested resource could not be found
                          on the server.
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-icons d-flex align-items-center justify-content-center">
                      <div className="copy-btn-icon">
                        <div className="cursor-pointer d-none">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="#444445"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="#444445"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Table with bootstrap ends */}
      </BottomSectionScroll>
    </Continer>
  );
};
