import { call, all, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { TemplateActions } from './redux';

export function* template(api) {
  yield call(requestSaga, {
    errorSection: 'template',
    loadingSection: 'template',
    apiMethod: api.template,
    successAction: TemplateActions.templateSuccess,
  });
}

export function* templateSagas(api) {
  yield all([takeLatest(TemplateActions.template, template, api)]);
}
