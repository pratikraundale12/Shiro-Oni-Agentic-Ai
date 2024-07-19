import "./index.css";
import { BrandLogo, ChatBoxIcon } from "../../assets";

export const LeftSectionLayout = ({contentDisplay:ContentDisplay}) => {
  return (
    <div className="col-xl-5 px-0 col-md-6 position-relative">
      <div className="left-box forgot-box d-flex justify-content-center align-items-center h-100 flex-column">
        <div className="brand-logo">
          <BrandLogo />
        </div>
        <ContentDisplay />
        <div className="position-relative">
          <div className="version">Version 1.5.7</div>
          <button className="chat-box-btn">
            <ChatBoxIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
