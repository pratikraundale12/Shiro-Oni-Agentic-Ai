import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { AiFlowSuggestionsIcon } from '../../assets/Icons/AiFlowSuggestionsIcon';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';
import { v4 as uuidv4 } from 'uuid';
import { KDFM } from '../../constants';
import { toast } from 'react-toastify';
import { validatePayload } from './utils';
import { AiFlowGeneratorActions, AuthenticationSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { GENAI_CONFIG } from '../../constants/aiFlowGenerator.constant';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ChatWindowBg = styled.div`
  min-width: 205px;
  min-height: 160px;
  background: #f5f7fa;
  overflow: hidden;
  border-radius: 20px;
  display: flex !important;
  flex-direction: column;
  margin: 0 10px;
`;

const Header = styled.div`
  background: #d8dee5;
  padding: 10px;
`;

const Message = styled.div`
  color: #727378;
  font-size: 16px;
  font-family: 'Red Hat Display', sans-serif;
  font-weight: 400;
  line-height: 20px;
  word-wrap: break-word;
  padding: 10px;
`;

const Frame = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NotificationIcon = styled.div`
  position: relative;
`;

const Label = styled.div`
  width: 87%;
  color: #444445;
  font-size: 14px;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 10px;
`;

const GenerateButton = styled.div`
  color: #ff7a00;
  font-size: 16px;
  font-family: 'Red Hat Display', sans-serif;
  font-weight: 700;
`;

const StyledSlider = styled(Slider)`
  .slick-slider {
    margin-bottom: 10px;
  }
  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;
    z-index: 10;
    background: #b7bec6;
    border-radius: 13px;
  }
  .slick-track {
    display: flex;
    gap: 20px;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 0px;
    color: transparent;
  }

  .slick-prev,
  .slick-next {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${({ disabled }) =>
    disabled ? 0.3 : 1}; // Reduce opacity when disabled
  cursor: ${({ disabled }) =>
    disabled ? 'not-allowed' : 'pointer'}; // Disable interaction
`;

const CustomPrevArrow = ({ onClick, currentSlide }) => (
  <ArrowButton
    className="slick-prev"
    disabled={currentSlide <= 0}
    onClick={onClick}
  >
    <GreaterArrowIcon color="#ffffff" />
  </ArrowButton>
);

const CustomNextArrow = ({ onClick, currentSlide, slideCount }) => (
  <ArrowButton
    className="slick-next"
    onClick={onClick}
    disabled={currentSlide >= slideCount - 4}
  >
    <LessArrowIcon color="#ffffff" />
  </ArrowButton>
);
CustomPrevArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
  currentSlide: PropTypes.number,
};

CustomNextArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
};
const SuggetionsChip = ({
  SuggetionsArray,
  setOpenConversation,
  generateFlowPermission,
  setQueryLable,
  setQueryText,
  refresh,
  setisInputEmpty,
  setIsPromptInputDisabled,
}) => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);

  const handleGenerateFLowClick = flow => {
    if (!generateFlowPermission) {
      if (!toast.isActive('permission-error')) {
        toast.error(KDFM.NO_PERMISSION_TO_GENERATE_FLOW, {
          toastId: 'permission-error',
        });
      }
      return;
    }
    setIsPromptInputDisabled(true);
    setisInputEmpty(true);
    setQueryText(flow?.query);
    setQueryLable(flow?.name);
    setOpenConversation(true);
    const payload = {
      session_id: uuidv4(),
      is_audio: false,
      query: flow?.query,
      embedding_model: GENAI_CONFIG.EMBEDDING_MODEL,
      engine: GENAI_CONFIG.APP_ENGINE,
      dept_id: GENAI_CONFIG.DEPT_ID,
      org_id: GENAI_CONFIG.ORG_ID,
      user_id: GENAI_CONFIG.USER_ID,
      type: GENAI_CONFIG.APP_TYPE,
      short_name: flow?.name || '',
      refresh: refresh,
      logged_in_user: currentUser?.id,
      user_role: currentUser?.role,
    };
    const requiredFields = [
      'session_id',
      'query',
      'embedding_model',
      'engine',
      'dept_id',
      'org_id',
      'user_id',
      'type',
      'logged_in_user',
      'user_role',
    ];
    if (validatePayload(payload, requiredFields)) {
      dispatch(AiFlowGeneratorActions.generateFlowAPI(payload));
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: (
      <CustomPrevArrow
        currentSlide={currentSlide}
        onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
      />
    ),
    nextArrow: (
      <CustomNextArrow
        currentSlide={currentSlide}
        slideCount={SuggetionsArray.length}
        onClick={() => setCurrentSlide(prev => prev + 1)}
      />
    ),
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <StyledSlider className="mb-2" {...settings}>
      {SuggetionsArray?.map((item, index) => (
        <ChatWindowBg key={index}>
          <Header>
            <Frame>
              <NotificationIcon>
                <AiFlowSuggestionsIcon color="#444445" />
              </NotificationIcon>
              <Label data-tooltip-id={`${item?.id}-query-tooltip`}>
                {item?.name}
              </Label>
              <ReactTooltip
                id={`${item?.id}-query-tooltip`}
                place="top"
                content={item?.name}
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  zIndex: 9999,
                }}
              />
            </Frame>
          </Header>
          <Message>{item?.query}</Message>
          <Footer onClick={() => handleGenerateFLowClick(item)}>
            <GenerateButton>Generate</GenerateButton>
            <LessArrowIcon color="#FF7A00" />
          </Footer>
        </ChatWindowBg>
      ))}
    </StyledSlider>
  );
};

export default SuggetionsChip;

SuggetionsChip.propTypes = {
  SuggetionsArray: PropTypes.array.isRequired,
  setQueryLable: PropTypes.func.isRequired,
  refresh: PropTypes.func,
  generateFlowPermission: PropTypes.bool,
  setOpenConversation: PropTypes.func,
  setQueryText: PropTypes.func,
  setisInputEmpty: PropTypes.func,
  setIsPromptInputDisabled: PropTypes.func,
};
