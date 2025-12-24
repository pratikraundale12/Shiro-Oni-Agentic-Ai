export const agenticAiAPI = api => {
  const fetchSessionId = async () => {
    try {
      return await api.get(`/conversation/session`);
    } catch (error) {
      return error?.response?.data;
    }
  };

  const fetchMessageChatAi = async ({ payload }) => {
    try {
      return await api.post(`/conversation/chat`, payload);
    } catch (error) {
      return error?.response?.data;
    }
  };

  return {
    fetchSessionId,
    fetchMessageChatAi,
  };
};
