export const AI_FLOW_GENERATOR_CONSTANTS = {
  AI_FLOW_GENERATOR: 'AI-Powered Data Flow',
  RECOMMENDED_FLOWS: 'Recommended Flows',
  RECENT_GENERATED_FLOWS: 'Recent Generated Flows',
  PROMPT_INPUT_PLACEHOLDER: 'Enter your prompt here...',
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
    name: 'Local File to SFTP – Unzip and Transfer Flow',
    query:
      'Generate a data flow which fetches the file from the local file system , and unzip the file and puts it in a SFTP server',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 2,
    name: 'SFTP File Fetch → Unzip → SFTP Upload',
    query:
      'Generate a data flow which list and fetches the file from the SFTP server , and unzip the file and puts it in a SFTP server',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Batch',
  },
  {
    id: 3,
    name: 'Local File Transfer Between Folders',
    query:
      'Generate a data flow which gets the file from the local file-system and puts it in a different folder',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 4,
    name: 'S3 Ingestion to Local File System',
    query:
      'Generate a data flow which lists and fetch the data from the s3 bucket and puts it in a local folder',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 5,
    name: 'S3 to SFTP Data Transfer Flow',
    query:
      'Generate a data flow which lists and fetch the data from the s3 bucket and puts it in a SFTP server',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 6,
    name: 'Cross-Bucket S3 Transfer Flow',
    query:
      'Generate a data flow which lists and fetch the data from the s3 bucket and puts it in a different s3 bucket',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 7,
    name: 'FTP to SFTP File Transfer Flow',
    query:
      'Generate a data flow which lists and fetches the data from the FTP server and puts it in a SFTP server',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 8,
    name: 'Local Files Transfer to FTP Server',
    query:
      'Generate a data flow which fetches the files from the local file system and puts it into the FTP server',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 9,
    name: 'External API Data Ingestion to Local Files',
    query:
      'Generate a data flow which gets the data from the external api and then it stores the data to the local filesystem',
    lastRun: '2021-08-01',
    nextRun: '2021-08-02',
    flowType: 'Stream',
  },
  {
    id: 10,
    name: 'External API Data Ingest with Zipping to Local FS',
    query:
      'Generate a data flow which gets the data from the external api and then it zips the data and transfers the data to the local filesystem',
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

export const AGENTIC_AI_CONSTANTS = {
  AGENTIC_AI: 'Agentic AI',
};
