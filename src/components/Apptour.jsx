/*eslint-disable*/
import Joyride from 'react-joyride';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AuthenticationActions,
  ClustersActions,
  ClustersSelectors,
} from '../store';
import { theme } from '../styles';

export const Tour = () => {
  const dispatch = useDispatch();

  const stepIndex = useSelector(ClustersSelectors.getTourIndex);
  const run = useSelector(ClustersSelectors.getTourStart);

  const steps = [
    {
      target: 'body',
      content: 'Here’s a quick tour to get you started.',
      placement: 'center',
      disableBeacon: true,
      title: 'Welcome to DFM!',
    },
    {
      content: (
        <div style={{ width: '100%', textAlign: 'justify' }}>
          This module provides a list of all clusters within the NiFi instance,
          including those previously registered or newly created in DFM. To
          deploy or upgrade a flow, simply log in to the respective cluster.
          <br /> <br />
          <b> Click the cluster tab above!</b>
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      // hideCloseButton: true,
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
      target: '.test-cluster',
      content:
        'Click this icon to log in to the cluster and access all the process groups and configurations associated with it. ',
      disableBeacon: true,
      spotlightClicks: true,
      hideFooter: true,
      title: 'Cluster Login',
    },
    {
      target: '.cluster-login-modal-111',
      content:
        'Select the cluster, enter the username and password, and click Submit.',
      disableBeacon: true,
      spotlightClicks: true,
      hideFooter: true,
      title: 'Cluster Login',
    },

    {
      content: (
        <div>
          This module offers a library of pre-built, ready-to-deploy flows. You
          can deploy them instantly or customize them to fit your specific use
          case.
          <br /> <br />
          <b> Click the Inventory tab above!</b>
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
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
      content: (
        <div>
          Either add this flow to the Registry for deployment or upgrade, or
          download it in JSON format for local use and customization.
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.dfi-card-one',
      title: 'Pre-Built Flow ',
    },
    {
      target: 'body',
      placement: 'center',
      title: 'Tour Direction',
      content: (
        <div style={{ textAlign: 'justify' }}>
          <p>
            In next modal press <b>Continue</b> to get redirected to the Process
            Group module.
          </p>
          <p>
            Click <b>Next</b> to continue the tour.
          </p>
        </div>
      ),
      disableBeacon: true,
      spotlightClicks: false,
      hideFooter: false,
      disableOverlayClose: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
    },
    {
      content: (
        <div>
          Click this button to get started with deploying the process group.
        </div>
      ),
      disableBeacon: true,
      disableOverlayClose: true,
      // hideCloseButton: true,
      hideFooter: true,
      placement: 'bottom',
      spotlightClicks: true,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: '.tour-process-group-deploy',
      title: 'Process Group Deploy',
    },
    {
      target: 'body',
      content: (
        <div>
          <p>
            Choose the Bucket and Flow Name from the respective dropdowns and
            continue to deploy the flow.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      title: 'Deploy Process Group',
      locale: {
        last: 'End the Tour',
      },
      customStepId: 'tour-end-last-step',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(ClustersActions.setTourStart(true)),
      500
    );
    return () => clearTimeout(timer);
  }, []);

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
      disableOverlayClose={true}
      spotlightClicks={false}
      // showProgress
      styles={{
        options: {
          zIndex: 10000,
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          primaryColor: '#007bff',
          backgroundColor: '#fff',
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
          backgroundColor: '#fff',
          border: `1px solid ${theme.colors.primary}`,
          color: theme.colors.primary,
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: '500',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        },
        buttonBack: {
          display: 'none',
        },
        buttonClose: {
          border: `1px solid ${theme.colors.primary}`,
          borderRadius: '50%',
          width: '14px',
          height: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.primary,
          backgroundColor: '#fff',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          padding: 4,
          right: '5px',
          top: '5px',
        },
      }}
      callback={data => {
        const { index, type, action, status, lifecycle } = data;

        if (action === 'close' || status === 'skipped') {
          dispatch(ClustersActions.setTourStart(false));
          dispatch(ClustersActions.setTourIndex(0));
          dispatch(AuthenticationActions.setDfmTour(false));

          return;
        }
        if (action === 'update' && index === 3 && lifecycle === 'tooltip') {
          setTimeout(() => {
            dispatch(ClustersActions.setTourStart(false));
          }, 4000);
          return;
        }
        if (type === 'step:after' && index === 4) {
          setTimeout(() => {
            dispatch(ClustersActions.setTourStart(false));
          }, 2000);
          return;
        }
        if (index === 6 && action === 'next') {
          dispatch(ClustersActions.setTourStart(false));

          return;
        }
        if (type === 'spotlight:click' && index === 6) {
          dispatch(ClustersActions.setTourIndex(stepIndex + 1));
        }

        if (
          type === 'step:after' &&
          index !== 2 &&
          index !== 3 &&
          index !== 4 &&
          index !== 5
        ) {
          dispatch(ClustersActions.setTourIndex(stepIndex + 1));
        }
        if (type === 'step:after' && index === 2) {
          dispatch(ClustersActions.setTourIndex(3));
        }
        if (type === 'tour:end' && status === 'finished' && action === 'next') {
          dispatch(AuthenticationActions.setDfmTour(false));
          dispatch(ClustersActions.setTourStart(false));
          dispatch(ClustersActions.setTourIndex(0));
        }
      }}
    />
  );
};
