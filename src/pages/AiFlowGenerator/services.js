import { AiFlowGeneratorActions } from '../../store';

export const fetchDefaultRecentFlowsData = dispatch => {
  dispatch(AiFlowGeneratorActions.fetchDefaultRecentFlows());
};
