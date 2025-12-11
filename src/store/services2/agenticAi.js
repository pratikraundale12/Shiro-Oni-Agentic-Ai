export const agenticAiAPI = api => {
  const fetchSessionId = async clusterId => {
    try {
      return await api.get(`/clusters/${clusterId}/conversation/session`);
    } catch (error) {
      return error?.response?.data;
    }
  };

  const fetchMessageChatAi = async ({ clusterId, payload }) => {
    try {
      return await api.post(
        `/clusters/${clusterId}/conversation/chat`,
        payload
      );
    } catch (error) {
      return error?.response?.data;
    }
  };

  return {
    fetchSessionId,
    fetchMessageChatAi,
  };
};
