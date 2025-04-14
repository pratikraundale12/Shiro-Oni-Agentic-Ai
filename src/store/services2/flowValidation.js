export const flowValidationAPI = api => {
  const ruleScopeApi = () => api.get(`/rule-scopes`);
  const fetchRuleApi = id => api.get(`/rules/${id}`);
  const addRuleScope = data => api.post(`/add-rule-scope`, data);
  const updateRuleScope = (id, data) => api.put(`/rule-scope/${id}`, data);
  const fetchPropertyApi = type => api.get(`/rule-properties?type=${type}`);
  const validateRulesApi = (clusterId, namespaceId, data) =>
    api.post(`/clusters/${clusterId}/namespaces/${namespaceId}/validate`, data);
  const compareRulesApi = (clusterId, namespaceId, data) =>
    api.post(
      `/clusters/${clusterId}/namespaces/${namespaceId}/compare-flow-versions`,
      data
    );
  const updateRuleApi = (id, data) => api.put(`/rule/${id}`, data);
  const createRule = data => api.post(`/add-rule`, data);
  const deleteRuleScope = id => api.delete(`/rule-scope/${id}`);
  const deleteRule = id => api.delete(`/rule/${id}`);
  const emailReportApi = data => api.post(`/namespace/email-report`, data);
  const validateRandomFlowApi = data => api.post(`/validate-random-flow`, data);
  const getFlows = () => {
    return new Promise(
      resolve =>
        setTimeout(() => {
          resolve({
            ok: true,
            data: [
              {
                id: 1,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: [
                  'Generative AI',
                  'Data Lakes & Data Warehouses',
                  'Data Lakes & Data Warehouses',
                  'Data Lakes & Data Warehouses',
                ],
                additionalTags: 1,
                highlighted: true,
              },
              {
                id: 2,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 3,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 4,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 5,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 6,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 7,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 8,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 9,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 10,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 11,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 12,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 13,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 14,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 15,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 16,
                title: 'S3 to Pinecone (Technical Preview)',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
              {
                id: 17,
                title: 'data pipe line',
                description:
                  'Consumed PDF documents from S3, Vectorizes them using an OpenAI model and writes results to Pinecone',
                version: 1,
                tags: ['Generative AI', 'Data Lakes & Data Warehouses'],
                additionalTags: 1,
              },
            ],
          });
        }, 500) // Simulate network delay
    );
  };

  return {
    ruleScopeApi,
    fetchRuleApi,
    addRuleScope,
    updateRuleScope,
    fetchPropertyApi,
    validateRulesApi,
    compareRulesApi,
    updateRuleApi,
    createRule,
    deleteRuleScope,
    deleteRule,
    emailReportApi,
    validateRandomFlowApi,
    getFlows,
  };
};
