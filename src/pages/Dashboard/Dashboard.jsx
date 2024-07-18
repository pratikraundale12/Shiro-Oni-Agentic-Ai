import {
  ActiveThreadIcon,
  DisabledProcessorIcon,
  FlowFiledQuedIcon,
  LensIcon,
  ProcessorDashbaordIcon,
  RunnigProcessorIcon,
  StoppedProcessorIcon,
  TotalProcessorIcon,
  TotalQuedIcon,
} from "../../assets";
import { InvalidProcessorIcon } from "../../assets/Icons/InvalidProcessorIcon";
import { InsightContainer } from "../../components/Dashboard/InsightDataContainer.jsx/InsightContainer";

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
                {/* custom-dropdown-1 */}
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
                {/* custom-dropdown-1 */}

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
                {/* custom-dropdown-1 */}
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
                    count={"11 Mb"}
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
                  <svg
                    width={20}
                    height={21}
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.624062 2.72096H3.28974C3.63386 2.72096 3.9138 3.0009 3.9138 3.34502V19.4101C3.9138 19.7542 3.63386 20.0341 3.28974 20.0341H0.624062C0.279944 20.0341 2.11645e-06 19.7542 2.11645e-06 19.4101V3.34502C-0.000889333 3.0009 0.279944 2.72096 0.624062 2.72096ZM19.8226 6.32442H18.1074C18.0093 6.32442 17.9282 6.24418 17.9282 6.14612C17.9282 3.89595 16.105 2.07183 13.8539 2.07183C11.6028 2.07183 9.77962 3.89497 9.77962 6.14612C9.77962 6.24418 9.69938 6.32442 9.60131 6.32442H7.88606C7.788 6.32442 7.70776 6.24418 7.70776 6.14612C7.70776 2.75126 10.4599 0 13.8539 0C17.2478 0 20 2.75126 20 6.14612C20.0009 6.24418 19.9207 6.32442 19.8226 6.32442ZM15.5897 3.89678C15.4596 3.89946 15.382 3.94671 15.2902 4.03318L14.3889 4.97995C14.6474 5.09852 14.8614 5.30269 14.9933 5.55497L15.8928 4.60998C16.1808 4.28457 15.9214 3.88875 15.5897 3.89678ZM14.0011 4.87119L15.0192 3.80138C15.5362 3.25757 16.3547 3.62932 16.3707 4.29348C16.376 4.50834 16.2976 4.69911 16.1496 4.85512L15.1199 5.93652C15.2474 6.71749 14.6456 7.42892 13.854 7.42892C12.7155 7.42892 12.1423 6.0453 12.9464 5.23936C13.2174 4.96835 13.5999 4.82573 14.0011 4.87119ZM14.5092 5.49169C13.928 4.90864 12.9286 5.32409 12.9286 6.14606C12.9286 6.96804 13.928 7.3817 14.5092 6.80043C14.8703 6.43937 14.8703 5.85277 14.5092 5.49169ZM14.0332 0.35844V1.71798C15.1226 1.76077 16.1104 2.19673 16.8593 2.88942L17.8203 1.92838C16.8254 0.992291 15.497 0.403012 14.0332 0.35844ZM13.6766 1.71887V0.35933C12.2127 0.403905 10.8854 0.992291 9.88941 1.92838L10.8504 2.88942C11.5993 2.19762 12.5871 1.76166 13.6766 1.71887ZM10.5983 3.14172L9.63724 2.18068C8.70115 3.1765 8.11276 4.50402 8.06908 5.96877H9.42773C9.47141 4.87847 9.90737 3.89064 10.5983 3.14172ZM18.0718 2.17979L17.1107 3.14083C17.8025 3.88968 18.2394 4.87838 18.2822 5.96695H19.6417C19.598 4.50398 19.0087 3.17577 18.0718 2.17979ZM17.3728 9.66217C17.692 9.34302 18.1876 9.2913 18.563 9.52577C18.9249 9.02475 19.2066 8.46311 19.393 7.85865H16.0711C15.5781 8.49519 14.8373 8.89101 14.0331 8.94094V11.1341C14.4085 11.2054 14.708 11.4933 14.7936 11.8633C15.694 11.7171 16.5258 11.3623 17.2345 10.8523C17 10.4788 17.0519 9.9831 17.3728 9.66217ZM18.826 9.76915C19.2967 10.4003 18.8474 11.3088 18.0521 11.3088C17.8498 11.3088 17.6465 11.2446 17.4762 11.118C16.7024 11.6814 15.7949 12.0692 14.8071 12.2235C14.6939 13.0018 13.7338 13.3272 13.1721 12.7655C13.0277 12.6211 12.9296 12.433 12.8993 12.2235C11.9124 12.0693 11.004 11.6814 10.2302 11.118C9.59903 11.5887 8.69058 11.1376 8.69058 10.3442C8.69058 10.1409 8.75477 9.93855 8.88137 9.76828C8.43918 9.16206 8.10576 8.47202 7.90785 7.72673C7.87932 7.61351 7.9649 7.50296 8.07902 7.50296H11.7254C11.7913 7.50296 11.8466 7.53684 11.8787 7.58855C12.3414 8.21973 13.0698 8.59059 13.8543 8.59059C14.6379 8.59059 15.3663 8.21973 15.8298 7.58855C15.8619 7.53684 15.9181 7.50296 15.9832 7.50296H19.6296C19.7446 7.50296 19.8319 7.61351 19.8007 7.72673C19.6037 8.47291 19.2694 9.16206 18.8263 9.76917L18.826 9.76915ZM13.6767 11.1358V8.94272C12.8726 8.8928 12.1309 8.49698 11.6388 7.86043H8.31693C8.50415 8.46487 8.78676 9.02564 9.14692 9.52755C9.78346 9.13083 10.6197 9.58817 10.6197 10.3459C10.6197 10.5225 10.5715 10.6999 10.4744 10.855C11.184 11.365 12.014 11.7198 12.9152 11.866C13.0017 11.4942 13.3014 11.2063 13.6767 11.1358ZM10.2641 10.3451C10.2641 9.80571 9.60794 9.53381 9.22637 9.91538C8.8448 10.2969 9.1176 10.9531 9.65607 10.9531C9.99218 10.9531 10.2641 10.6803 10.2641 10.3451ZM14.2847 11.6538C13.9032 11.2722 13.247 11.5433 13.247 12.0835C13.247 12.6229 13.9032 12.8948 14.2847 12.5132C14.5219 12.277 14.5219 11.8909 14.2847 11.6538ZM18.0541 9.73709C17.5156 9.73709 17.2428 10.3932 17.6244 10.7748C18.0078 11.1564 18.6621 10.8836 18.6621 10.3451C18.6612 10.009 18.3893 9.73709 18.0541 9.73709ZM16.0286 15.2679H18.6943C19.0384 15.2679 19.3183 15.5478 19.3183 15.892V19.4098C19.3183 19.754 19.0384 20.0339 18.6943 20.0339H16.0286C15.6845 20.0339 15.4045 19.754 15.4045 19.4098V15.892C15.4045 15.5478 15.6854 15.2679 16.0286 15.2679ZM18.6961 15.6245H16.0304C15.8842 15.6245 15.7639 15.7458 15.7639 15.892V19.4098C15.7639 19.556 15.8833 19.6773 16.0304 19.6773H18.6961C18.8423 19.6773 18.9627 19.556 18.9627 19.4098L18.9618 15.892C18.9618 15.7458 18.8423 15.6245 18.6961 15.6245ZM14.185 13.9841V19.4097C14.185 19.7539 13.9051 20.0338 13.5609 20.0338H10.8953C10.5511 20.0338 10.2712 19.7539 10.2712 19.4097L10.2703 13.2041C10.2703 13.0775 10.404 12.9794 10.5378 13.0489C11.0442 13.2941 11.5826 13.484 12.1443 13.6106C12.7416 13.747 13.371 13.804 14.0004 13.8014C14.1207 13.8023 14.185 13.8593 14.185 13.9841ZM13.8266 19.4097V14.1587C12.7176 14.1552 11.6299 13.9234 10.6278 13.4812V19.408C10.6278 19.5542 10.7473 19.6754 10.8944 19.6754H13.5601C13.7071 19.6772 13.8266 19.556 13.8266 19.4097ZM5.75839 7.48404H6.1667C6.25496 7.48404 6.32985 7.55091 6.34233 7.6356C6.5135 8.50927 6.83534 9.32769 7.27484 10.0657C7.72773 10.8244 8.30719 11.4966 8.98297 12.0547C9.02576 12.0903 9.04716 12.1403 9.04716 12.192L9.04894 19.4096C9.04894 19.7537 8.769 20.0337 8.42488 20.0337H5.75921C5.41509 20.0337 5.13515 19.7537 5.13515 19.4096V8.10788C5.13425 7.76465 5.41509 7.48382 5.75832 7.48382L5.75839 7.48404ZM6.02226 7.84154H5.75928C5.61307 7.84154 5.49271 7.961 5.49271 8.1081V19.4089C5.49271 19.5551 5.61217 19.6764 5.75928 19.6764H8.42495C8.57116 19.6764 8.69152 19.5551 8.69152 19.4089V12.2741C7.34177 11.1357 6.39564 9.57993 6.02226 7.84154ZM3.29063 3.07733H0.624039C0.477834 3.07733 0.357472 3.19857 0.357472 3.34478V19.4098C0.357472 19.556 0.476934 19.6773 0.624039 19.6773H3.28971C3.43592 19.6773 3.55628 19.556 3.55628 19.4098V3.34478C3.55628 3.19858 3.43684 3.07733 3.29063 3.07733Z"
                      fill="black"
                    />
                  </svg>
                  <p className="mb-0">Flow Metrics</p>
                </div>
                <div className="bg-white p-3 graph-container">
                  /* Graph will be here */
                </div>
              </div>
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
                              {/* d-none class used for copy button for visibilty zero. */}
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
                              {/* d-none class used for copy button for visibilty zero. */}
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
            </div>
          </div>
        </main>
      </>
    </div>
  );
};
