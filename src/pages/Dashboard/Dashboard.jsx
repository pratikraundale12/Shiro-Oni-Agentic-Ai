import React from 'react';
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
} from '../../assets';
import { InvalidProcessorIcon } from '../../assets/Icons/InvalidProcessorIcon';
import './index.css';
import { FlowMetricsChart } from '../../components/Dashboard';
import { InsightContainer } from '../../components/Dashboard/InsightContainer';
export const Dashboard = () => {
  return (
    <div>
      <>
        <main className="main-view-area d-flex align-items-start justify-content-start position-relative">
          <div className="main-space bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center main-title-div">
                <div>
                  <LensIcon />
                </div>
                <h4 className="mb-0">Quick Insight</h4>
              </div>
              <div className="d-flex align-items-center dropdown-div">
                <div className="custom-dropdown-1">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="floating-label position-absolute">
                        Select Cluster
                      </span>
                      <div className="d-flex align-items-center text-span-set">
                        <span>Select Cluster</span>
                      </div>
                      <div className="arrow-div">
                        <svg
                          width={16}
                          height={17}
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.6668 6.1665L8.00016 10.8332L3.3335 6.1665"
                            stroke="#58616F"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    <ul
                      className="dropdown-menu p-0 w-100 border-0"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li className="w-100">Staging</li>
                      <li className="w-100">Devlopment</li>
                      <li className="w-100">Production</li>
                    </ul>
                  </div>
                </div>

                <div className="custom-dropdown-1">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="floating-label position-absolute">
                        Select Namespace
                      </span>
                      <div className="d-flex align-items-center text-span-set">
                        <span>Select Namespace</span>
                      </div>
                      <div className="arrow-div">
                        <svg
                          width={16}
                          height={17}
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.6668 6.1665L8.00016 10.8332L3.3335 6.1665"
                            stroke="#58616F"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    <ul
                      className="dropdown-menu p-0 w-100 border-0"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li className="w-100">Kafka To Postgres</li>
                      <li className="w-100">Kafka To Hive</li>
                      <li className="w-100">Mongo To MySql</li>
                    </ul>
                  </div>
                </div>
                <div className="custom-dropdown-1">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="floating-label position-absolute d-none">
                        Refresh
                      </span>
                      <div className="d-flex align-items-center text-span-set">
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.55198 3.69369C6.0128 2.43057 7.91709 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984C18.3332 11.7799 17.775 13.4297 16.8242 14.7837L14.1665 9.99984H16.6665C16.6665 6.31794 13.6818 3.33317 9.99984 3.33317C8.20802 3.33317 6.58131 4.04006 5.38336 5.19019L4.55198 3.69369ZM15.4477 16.306C13.9868 17.5691 12.0826 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 8.21972 2.22466 6.56997 3.1755 5.21604L5.83317 9.99984H3.33317C3.33317 13.6818 6.31794 16.6665 9.99984 16.6665C11.7917 16.6665 13.4183 15.9596 14.6163 14.8095L15.4477 16.306Z"
                            fill="#444444"
                          />
                        </svg>
                        <span>Refresh</span>
                      </div>
                      <div className="arrow-div">
                        <svg
                          width={16}
                          height={17}
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.6668 6.1665L8.00016 10.8332L3.3335 6.1665"
                            stroke="#58616F"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    <ul
                      className="dropdown-menu p-0 w-100 border-0"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li className="w-100">Off</li>
                      <li className="w-100">Auto</li>
                      <li className="w-100">5 Seconds</li>
                      <li className="w-100">10 Seconds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="scroll-set-1 pe-1">
              <div className="dashboard-insight my-3">
                <div className="row">
                  <InsightContainer
                    backgroundCss="col-set1"
                    icon={TotalProcessorIcon}
                    count={2604}
                    text="Total Processor"
                  />
                  <InsightContainer
                    backgroundCss="col-set2"
                    icon={RunnigProcessorIcon}
                    count={24}
                    text="Running Processor"
                  />

                  <InsightContainer
                    backgroundCss="col-set3"
                    icon={StoppedProcessorIcon}
                    count={240}
                    text="Stopped Processor"
                  />
                  <InsightContainer
                    backgroundCss="col-set4"
                    icon={DisabledProcessorIcon}
                    count={126}
                    text="Disabled Processor"
                  />
                  <InsightContainer
                    backgroundCss="col-set5"
                    icon={InvalidProcessorIcon}
                    count={26}
                    text="Invalid Processor"
                  />
                  <InsightContainer
                    backgroundCss="col-set6"
                    icon={ActiveThreadIcon}
                    count={260}
                    text="Active Thread"
                  />
                  <InsightContainer
                    backgroundCss="col-set7"
                    icon={TotalQuedIcon}
                    count={'11 Mb'}
                    text="Total Queued"
                  />
                  <InsightContainer
                    backgroundCss="col-set8"
                    icon={FlowFiledQuedIcon}
                    count={26}
                    text="Flow Files Queued"
                  />
                </div>
              </div>
              <div className="dashboard-graph mb-3">
                <div className="d-flex align-items-center head-title-container">
                  <FlowMetricHeaderIcon />
                  <p className="mb-0">Flow Metrics</p>
                </div>
                <div className="bg-white p-3 graph-container">
                  <FlowMetricsChart />
                </div>
              </div>
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
                              <path
                                d="M15 15L9 9"
                                stroke="white"
                                strokeWidth="1.2"
                              />
                            </svg>
                            <div className="flex-column d-flex align-items-start ms-1">
                              <span>
                                <strong>Error Code:</strong> 404 - File Not
                                Found
                              </span>
                              <span>
                                Description: The requested resource could not be
                                found on the server.
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
                              <path
                                d="M15 15L9 9"
                                stroke="white"
                                strokeWidth="1.2"
                              />
                            </svg>
                            <div className="flex-column d-flex align-items-start ms-1">
                              <span>
                                <strong>Error Code:</strong> 404 - File Not
                                Found
                              </span>
                              <span>
                                Description: The requested resource could not be
                                found on the server.
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
                              <path
                                d="M15 15L9 9"
                                stroke="white"
                                strokeWidth="1.2"
                              />
                            </svg>
                            <div className="flex-column d-flex align-items-start ms-1">
                              <span>
                                <strong>Error Code:</strong> 404 - File Not
                                Found
                              </span>
                              <span>
                                Description: The requested resource could not be
                                found on the server.
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
                              <path
                                d="M15 15L9 9"
                                stroke="white"
                                strokeWidth="1.2"
                              />
                            </svg>
                            <div className="flex-column d-flex align-items-start ms-1">
                              <span>
                                <strong>Error Code:</strong> 404 - File Not
                                Found
                              </span>
                              <span>
                                Description: The requested resource could not be
                                found on the server.
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
                              <path
                                d="M15 15L9 9"
                                stroke="white"
                                strokeWidth="1.2"
                              />
                            </svg>
                            <div className="flex-column d-flex align-items-start ms-1">
                              <span>
                                <strong>Error Code:</strong> 404 - File Not
                                Found
                              </span>
                              <span>
                                Description: The requested resource could not be
                                found on the server.
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
            </div>
          </div>
        </main>
      </>
    </div>
  );
};
