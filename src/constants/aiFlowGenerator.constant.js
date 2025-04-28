export const AI_FLOW_GENERATOR_CONSTANTS = {
  AI_FLOW_GENERATOR: 'AI-Powered Data Flow',
  RECOMMENDED_FLOWS: 'Recommended Flows',
  RECENT_GENERATED_FLOWS: 'Recent Generated Flows',
  PROMPT_INPUT_PLACEHOLDER: 'Enter your Prompt here...',
  LOGIN_TO_CLUSTER_TO_GENERATE_FLOWS:
    'Please login to cluster to generate the flows',
  NO_PERMISSION_TO_GENERATE_FLOW:
    'You do not have the permission to generate the flows please contact your Administrator.',
  EMPTY_QUERY: 'Query cannot be empty',
  ADD_TO_REGSITRY: 'Add to Registry',
  DATA_FLOW_MANAGER: 'Data Flow Manager',
  YOU: 'You',
  RESTART_CONVERSATION: 'Restart Conversation',
  VALIDATE_FLOW: 'Validate Flow',
};

export const GENAI_CONFIG = {
  USER_ID: 'f86142d6-82e3-4e44-bc1a-cc359a0c1d73',
  ORG_ID: 'd6069947-6be2-4ac5-ab4a-9b7faefbdcf2',
  DEPT_ID: '5ac1d38dbdd9e0d64b1d0fb86d598dd4',
  APP_TYPE: 'kms',
  APP_ENGINE: 'open_ai',
  EMBEDDING_MODEL: 'open_ai',
};

export const DEFAULT_FLOW_JSON = [
  {
    id: 1,
    name: 'S3 to PostgreSQL CSV Ingestion',
    query:
      'Create a NiFi flow to read CSV files from an S3 bucket and store them in PostgreSQL',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 2,
    name: 'API to MySQL Data Transformation',
    query:
      'Generate a NiFi pipeline to extract data from an API, transform it, and save it in MySQL',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Batch',
  },
  {
    id: 3,
    name: 'Local JSON to Kafka Publisher',
    query:
      'Build a NiFi flow to read JSON files from a local directory and push them to Kafka',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 4,
    name: 'Remote Logs to HDFS Storage',
    query:
      'Design a NiFi flow that ingests logs from a remote server and stores them in HDFS',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 5,
    name: 'MongoDB to Azure Parquet Upload',
    query:
      'Create a NiFi pipeline to fetch data from MongoDB, convert it to Parquet, and upload it to Azure Blob Storage',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 6,
    name: 'Kafka Content Based Routing',
    query:
      'Generate a flow to route incoming messages from Kafka to different topics based on content.',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
];

export const NIFI_VERSIONS = [
  '1.20.0',
  '1.21.0',
  '1.22.0',
  '1.23.0',
  '1.23.1',
  '1.23.2',
  '1.24.0',
  '1.25.0',
  '1.26.0',
  '1.27.0',
  '1.28.0',
  '2.0.0',
  '2.0.0-M1',
  '2.0.0-M2',
  '2.0.0-M3',
  '2.0.0-M4',
  '2.1.0',
  '2.2.0',
  '2.3.0',
];
