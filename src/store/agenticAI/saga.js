import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { NamespacesSelectors } from '../namespaces';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { AgenticAiActions } from './redux';
import { toast } from 'react-toastify';

export function* fetchSessionId(api, { payload }) {
  console.log('Agentic ai session id api called');
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );

  if (api.headers) {
    api.headers['x-cluster-id'] = selectedClusterToken?.id;
    api.headers['x-cluster-token'] = selectedClusterToken?.token;
  }

  const response = yield call(requestSaga, {
    errorSection: 'fetchSessionId',
    loadingSection: 'fetchSessionId',
    apiMethod: api.fetchSessionId,
    apiParams: [payload],
    // successAction: AgenticAiActions.getSessionIdSuccess,
  });
  console.log('resp', response);
  if (response.ok) {
    yield put(AgenticAiActions.setSessionId(response?.data?.session_id));
  } else {
    yield put(AgenticAiActions.setSessionIdError(response?.data));
    toast.error(
      response?.message || response?.data?.message || 'Failed to get session id'
    );
  }
}

export function* fetchMessageChatAi(api, { payload }) {
  console.log('Agentic ai message chat api called');
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const clusterId = selectedClusterToken?.id;

  if (!api.fetchMessageChatAi) {
    console.error('fetchMessageChatAi is undefined!');
    return;
  }

  if (api.headers) {
    api.headers['x-cluster-id'] = selectedClusterToken?.id;
    api.headers['x-cluster-token'] = selectedClusterToken?.token;
  }

  const serviceCallArgument = {
    clusterId: clusterId,
    payload: payload,
  };

  const response = yield call(requestSaga, {
    // errorSection: AiFlowGeneratorActions.messageChatAiFailure,
    loadingSection: 'fetchMessageChatAi',
    apiMethod: api.fetchMessageChatAi,
    apiParams: [serviceCallArgument],
    // successAction is not needed if we handle dispatch manually below
  });

  if (response.ok || response?.data?.status) {
    try {
      const resContent = response?.data?.message?.content;
      if (resContent) {
        yield put(AgenticAiActions.setMessageChatAi({ message: resContent }));
      } else {
        yield put(
          AgenticAiActions.setMessageChatAi({
            message: 'Received successful but empty response from AI.',
          })
        );
      }
    } catch (error) {
      toast.error('Failed to process the server response format.');
      yield put(
        AgenticAiActions.setMessageChatAiError({
          message: error?.message || 'Processing response failed.',
        })
      );
    }
  } else {
    let errorMessage =
      'Unable process the generation of the flow. Please try again!';

    if (response?.data?.message?.detail) {
      errorMessage = response.data.message.detail;
    } else if (typeof response?.data?.message === 'string') {
      errorMessage = response.data.message;
    }
    if (typeof errorMessage === 'object') {
      errorMessage = JSON.stringify(errorMessage);
    }
    yield put(
      AgenticAiActions.setMessageChatAiError({ message: errorMessage })
    );
    toast.error(errorMessage);
  }
}

export function* agenticAiSagas(api) {
  yield all([
    takeLatest(AgenticAiActions.fetchSessionId, fetchSessionId, api),
    takeLatest(AgenticAiActions.fetchMessageChatAi, fetchMessageChatAi, api),
  ]);
}
