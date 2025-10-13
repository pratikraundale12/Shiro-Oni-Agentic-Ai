/*eslint-disable*/
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Joyride from "react-joyride";

// export const AppTour = () => {
//   const navigate = useNavigate();
//   const [run, setRun] = useState(true);

//   const steps = [
//     {
//       target: ".dashboard-step",
//       content: "This is your dashboard",
//     },
//     {
//       target: ".settings-step",
//       content: "Here you can change settings",
//       // Navigate to settings page before showing this step
//     //   preStepCallback: () => navigate("/settings"),
//     },
//   ];

//   return <Joyride steps={steps} run={run} continuous showSkipButton />;
// };

// WORKING GOOD BUT HAV ISSUE IN NAVIGATEIN
// Tour.js
// import Joyride from 'react-joyride';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const Tour = () => {
//   const [run, setRun] = useState(false);
//   const navigate = useNavigate();

//   const steps = [
//     { target: '.test', content: 'Welcome to DFM!. Lets have a small tour' },
//     { target: '.cluster', content: 'This is Cluster Module' },
//     { target: '.settings-step', content: 'This is settings!' },
//   ];

//   useEffect(() => {
//     // Wait a short delay to ensure page elements are mounted
//     const timer = setTimeout(() => setRun(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     // when navigating, ensure Joyride re-runs after route change
//     if (location.pathname === '/clusters') {
//       setTimeout(() => {
//         setRun(true);
//         setStepIndex(1); // resume from 2nd step
//       }, 500); // small delay for DOM to mount
//     }
//   }, [location.pathname]);

//   return (
//     <Joyride
//       steps={steps}
//       run={run}
//       continuous
//       showSkipButton
//       scrollToFirstStep
//       styles={{ options: { zIndex: 10000 } }}
//       //   callback={data => {
//       //     const { index, type } = data;

//       //     // If step requires navigation
//       //     if (index === 0 && type === 'step:after') {
//       //       navigate('/clusters'); // navigate to next page
//       //     }
//       //   }}
//       callback={data => {
//         const { index, type } = data;

//         if (type === 'step:after') {
//           if (index === 0) {
//             setRun(false); // stop before navigating
//             navigate('/clusters');
//           } else if (index === 1) {
//             setRun(false);
//             navigate('/settings');
//           }
//         }
//       }}
//     />
//   );
// };

// NAVIGATION AUTO TO SEOCND STEP
// import Joyride from 'react-joyride';
// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { history } from '../helpers/history';

// export const Tour = () => {
//   const [run, setRun] = useState(false);
//   const [stepIndex, setStepIndex] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const steps = [
//     { target: '.test', content: 'Welcome to DFM!. Lets have a small tour' },
//     { target: '.cluster', content: 'This is Cluster Module' },
//     { target: '.settings-step', content: 'This is settings!' },
//   ];

//   useEffect(() => {
//     const timer = setTimeout(() => setRun(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     // when navigating, ensure Joyride re-runs after route change
//     if (location.pathname === '/clusters') {
//       setTimeout(() => {
//         setRun(true);
//         setStepIndex(1); // resume from 2nd step
//       }, 500); // small delay for DOM to mount
//     }
//   }, [location.pathname]);

//   return (
//     <Joyride
//       steps={steps}
//       run={run}
//       stepIndex={stepIndex}
//       continuous
//       showSkipButton
//       scrollToFirstStep
//       styles={{ options: { zIndex: 10000 } }}
//       callback={data => {
//         const { index, type } = data;

//         if (type === 'step:after') {
//           if (index === 0) {
//             setRun(false); // stop before navigating
//             navigate('/clusters');
//             dispatch(AuthenticationActions.setRoute('clusters'));
//             history.push(`/clusters`);
//           }
//           //   } else if (index === 1) {
//           //     setRun(false);
//           //     navigate('/settings');
//           //   }
//         }
//       }}
//     />
//   );
// };

// import Joyride from 'react-joyride';
// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { history } from '../helpers/history';
// import { AuthenticationActions } from '../store';

// export const Tour = () => {
//   const [run, setRun] = useState(false);
//   const [stepIndex, setStepIndex] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const shouldResumeRef = useRef(false); // track if navigation came from step 0

//   const steps = [
//     { target: '.test', content: 'Welcome to DFM!. Let’s have a small tour' },
//     { target: '.cluster', content: 'This is Cluster Module' },
//     { target: '.settings-step', content: 'This is settings!' },
//   ];

//   // Start tour on initial mount
//   useEffect(() => {
//     const timer = setTimeout(() => setRun(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

// //   Resume only if we actually navigated from the tour
//     useEffect(() => {
//       if (shouldResumeRef.current && location.pathname === '/clusters') {
//         const timer = setTimeout(() => {
//           setRun(true);
//           setStepIndex(1);
//           shouldResumeRef.current = false; // reset after resuming
//         }, 500);
//         return () => clearTimeout(timer);
//       }
//     }, [location.pathname]);

//     return (
//       <Joyride
//         steps={steps}
//         run={run}
//         stepIndex={stepIndex}
//         continuous
//         showSkipButton
//         scrollToFirstStep
//         styles={{ options: { zIndex: 10000 } }}
//         callback={data => {
//           const { index, type } = data;

//           if (type === 'step:after') {
//             if (index === 0) {
//               // mark that we need to resume next step after navigation
//               shouldResumeRef.current = true;
//               setRun(false);
//               navigate('/clusters');
//               dispatch(AuthenticationActions.setRoute('clusters'));
//               history.push('/clusters');
//             }
//           }
//         }}
//       />
//     );

// };

// till step 1 working good but not working there after

// import Joyride from 'react-joyride';
// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { history } from '../helpers/history';
// import { AuthenticationActions } from '../store';

// export const Tour = () => {
//   const [run, setRun] = useState(false);
//   const [stepIndex, setStepIndex] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const shouldResumeRef = useRef(false);

//   const steps = [
//     {
//       target: 'body', // Use 'body' to show modal in center
//       content: 'Welcome to DFM!. Let’s have a small tour',
//       placement: 'center', // Centers the tooltip
//       disableBeacon: true,
//     },
//     {
//       target: '.cluster',
//       content: 'This is Cluster Module',
//       disableBeacon: true,
//     },
//     {
//       target: '.test-cluster', // Last step in center
//       content: (
//         <div>
//           <p>End of tour!</p>
//           <button
//             onClick={() => {
//               setRun(false); // Close the Joyride
//             }}
//             style={{
//               marginTop: '10px',
//               padding: '6px 12px',
//               cursor: 'pointer',
//             }}
//           >
//             Finish
//           </button>
//         </div>
//       ),
//       placement: 'center',
//       disableBeacon: true,
//     },
//   ];

//   // Start tour on mount
//   useEffect(() => {
//     const timer = setTimeout(() => setRun(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Resume only if navigation came from step 0
//   useEffect(() => {
//     if (shouldResumeRef.current && location.pathname === '/clusters') {
//       const timer = setTimeout(() => {
//         setRun(true);
//         setStepIndex(1);
//         shouldResumeRef.current = false;
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [location.pathname]);

//   return (
//     <Joyride
//       steps={steps}
//       run={run}
//       stepIndex={stepIndex}
//       continuous
//       showSkipButton
//       scrollToFirstStep
//       disableScrolling={true}
//       disableBeacon={true}
//       disableOverlayClose={true} // Prevent clicking on grey area to close
//       spotlightClicks={false}
//       showProgress
//       styles={{
//         options: {
//           zIndex: 10000,
//           overlayColor: 'rgba(0,0,0,0.7)', // Dim background
//         },
//         tooltip: {
//           maxWidth: '400px',
//           textAlign: 'center',
//         },
//       }}
//       callback={data => {
//         const { index, type } = data;
//         if (type === 'step:after' && index === 0) {
//           shouldResumeRef.current = true;
//           //   setRun(false);
//           navigate('/clusters');
//           dispatch(AuthenticationActions.setRoute('clusters'));
//           history.push('/clusters');
//         }
//         if (type === 'tour:end') {
//           setRun(false); // Ensure modal closes
//         }
//       }}
//     />
//   );
// };

//   SELF MADE

import Joyride from 'react-joyride';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../helpers/history';
import {
  AuthenticationActions,
  ClustersActions,
  ClustersSelectors,
} from '../store';
import { theme } from '../styles';

export const Tour = () => {
  const [run, setRun] = useState(false);
  //   const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const stepIndex = useSelector(ClustersSelectors.getTourIndex);

  const shouldResumeRef = useRef(false);

  const steps = [
    {
      target: 'body', // Use 'body' to show modal in center
      content: 'Here’s a quick tour to get you started.',
      placement: 'center', // Centers the tooltip
      disableBeacon: true,
      title: 'Welcome to DFM!',
    },
    {
      content: (
        <div style={{ width: '100%', textAlign: 'justify' }}>
          This is cluster module, where you can see the clusters list which are
          either registered or created in the DFM. You can also login any
          cluster in the list to deploy/upgrade flow.
          <br /> <br />
          Click the module tab above to see cluster module!
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.cluster',
      title: 'Cluster Module',
    },
    {
      target: '.test-1',
      content: 'This is Cluster login icon',
      disableBeacon: true,
    },
    // {
    //   content: (
    //     <div>
    //       Click on this icon to login cluster
    //       <br />
    //       {/* Click the module tab above to see cluster login flow! */}
    //     </div>
    //   ),
    //   disableBeacon: true,
    //   disableOverlayClose: true,
    //   hideCloseButton: true,
    //   hideFooter: true,
    //   placement: 'bottom',
    //   spotlightClicks: true,
    //   styles: {
    //     options: {
    //       zIndex: 10000,
    //     },
    //   },
    //   target: '.test-cluster',
    //   title: 'Cluster Login',
    // },
    // {
    //   content: (
    //     <div>
    //       Click on this icon to login cluster
    //       <br />
    //       {/* Click the module tab above to see cluster login flow! */}
    //     </div>
    //   ),
    //   disableBeacon: true,
    //   disableOverlayClose: true,
    //   hideCloseButton: true,
    //   hideFooter: true,
    //   placement: 'bottom',
    //   spotlightClicks: true,
    //   styles: {
    //     options: {
    //       zIndex: 10000,
    //     },
    //   },
    //   target: '.login-modal-tour',
    //   title: 'Cluster Login',
    // },

    {
      target: '.test-cluster',
      content: 'This is Cluster Login icon',
      disableBeacon: true,
      title: 'Cluster Login',
    },
    {
      content: (
        <div>
          This is the Data Flow Inventory module, where pre-built flows are
          available for you to use.
          <br /> <br />
          Click the module tab above!
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.data_flow_inventory',
      title: 'Data flow inventory Module',
    },
    {
      target: 'body', // Last step in center
      content: (
        <div>
          <p>End of tour!</p>
          <button
            onClick={() => {
              setRun(false); // Close the Joyride
            }}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Finish
          </button>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  // Start tour on mount
  useEffect(() => {
    const timer = setTimeout(() => setRun(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Resume only if navigation came from step 0
  //   useEffect(() => {
  //     if (shouldResumeRef.current && location.pathname === '/clusters') {
  //       const timer = setTimeout(() => {
  //         setRun(true);
  //         setStepIndex(1);
  //         shouldResumeRef.current = false;
  //       }, 500);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [location.pathname]);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      scrollToFirstStep
      disableScrolling={true}
      disableBeacon={true}
      disableOverlayClose={true} // Prevent clicking on grey area to close
      spotlightClicks={false}
      showProgress
      styles={{
        options: {
          zIndex: 10000,
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          primaryColor: '#007bff', // Next button color
          backgroundColor: '#fff', // Tooltip background
          textColor: '#333',
          arrowColor: '#fff',
        },
        tooltip: {
          borderRadius: '16px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '450',
          lineHeight: '1.5',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        },
        tooltipContainer: {
          textAlign: 'center',
          backgroundColor: '#FFF7ED',
          borderRadius: '10px',
          padding: '16px',
          marginTop: '18px',
        },
        tooltipTitle: {
          fontSize: '22px',
          fontWeight: '800',
          //   color: '#222',
          color: theme.colors.primary,
          marginBottom: '-18px',
        },
        buttonNext: {
          backgroundColor: theme.colors.primary,
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: '500',
        },
        buttonSkip: {
          color: '#999',
          textTransform: 'uppercase',
          fontWeight: '500',
        },
        buttonBack: {
          display: 'none', // hides the back button
        },
      }}
      callback={data => {
        const { index, type, action, status } = data;
        if (action === 'close' || status === 'skipped') {
          setRun(false);
          dispatch(ClustersActions.setTourIndex(0));
          return;
        }
        if (type === 'step:after' && index !== 3) {
          //   setStepIndex(index + 1);
          dispatch(ClustersActions.setTourIndex(stepIndex + 1));
        }
        if (type === 'step:after' && index === 3) {
          dispatch(ClustersActions.setTourIndex(4));
        }

        // Tour ended
        if (type === 'tour:end') {
          setRun(false);
          //   setStepIndex(0); // reset for next time
          dispatch(ClustersActions.setTourIndex(0));
        }
      }}
    />
  );
};
