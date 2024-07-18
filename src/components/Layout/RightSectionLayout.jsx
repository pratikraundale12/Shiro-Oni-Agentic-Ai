import rightBoxLogo from "../../assets/Image/right-box-logo.png";
import './index.css';
export const RightSectionLayout = () => {
    return(
      <div className="col-xl-7 px-0 col-md-6 d-none d-md-block">
      <div className="right-box h-100 w-100 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-2 d-flex justify-content-center align-items-center flex-column">
          <img
            src={rightBoxLogo}
            alt="right-box-logo"
            loading="lazy"
            className="img-fluid right-img"
          />
          <div className="right-text">
            <p>
              Check out the Best Data <br className="d-md-block d-none" />
              Flow Management Tool!
            </p>
          </div>
        </div>
      </div>
    </div>
    )
  };
  