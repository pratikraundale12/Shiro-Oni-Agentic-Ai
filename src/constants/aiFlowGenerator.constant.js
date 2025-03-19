export const AI_FLOW_GENERATOR_CONSTANTS = {
  AI_FLOW_GENERATOR: 'AI Flow Generator',
  RECOMMENDED_FLOWS: 'Recommended Flows',
  RECENT_GENERATED_FLOWS: 'Recent Generated Flows',
  PROMPT_INPUT_PLACEHOLDER: 'Enter your Prompt here...',
  LOGIN_TO_CLUSTER_TO_GENERATE_FLOWS:
    'Please login to cluster to generate the flows',
  NO_PERMISSION_TO_GENERATE_FLOW:
    'You do not have the permission to generate the flows please contact your Administrator.',
  EMPTY_QUERY: 'Query cannot be empty',
};

export const DEFAULT_FLOW_JSON = [
  {
    id: 1,
    name: 'Streaming Data to Warehouse',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 2,
    name: 'CSVToJSONConverter',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Batch',
  },
  {
    id: 3,
    name: 'FileToPostgreSQL',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 4,
    name: 'CSVToMySQL',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 5,
    name: 'Put Data to Logs',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 6,
    name: 'PostgrestoMongo',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 7,
    name: 'PostgrestoMongo',
    query:
      'Create a Data Pipeline to Copy a  CSV Data from one directory to different directory',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
];
