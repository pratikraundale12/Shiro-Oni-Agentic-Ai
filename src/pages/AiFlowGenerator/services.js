import { AiFlowGeneratorActions } from '../../store';

export const fetchDefaultRecentFlowsData = dispatch => {
  console.log('fetchDefaultRecentFlows');
  dispatch(AiFlowGeneratorActions.fetchDefaultRecentFlows());
};
