// DB
const dbHost = 'DB_HOST';
const dbDatabase = 'DB_DATABASE';
const dbPort = 'DB_PORT';
const dbUsername = 'DB_USERNAME';
const dbPassword = 'DB_PASSWORD';
const dbSchema = 'DB_SCHEMA';

// Azure Blob
const azureConnectionString = 'AZURE_CONNECTION_STRING';
const azureContainer = 'AZURE_CONTAINER';
const azureAccountName = 'AZURE_ACCOUNT_NAME';
const azureAccountKey = 'AZURE_ACCOUNT_KEY';

// Azure OpenAI
const azureOpenAIEndpoint = 'AZURE_OPENAI_ENDPOINT';
const azureOpenAIKey = 'AZURE_OPENAI_KEY';
const azureOpenAIDeployment = 'AZURE_OPENAI_DEPLOYMENT';
const azureOpenAIApiVersion = 'AZURE_OPENAI_API_VERSION';

// Jwt
const jwtSecret = 'JWT_SECRET';
const jwtExpiresIn = 'JWT_EXPIRES_IN';

export const envVariables = {
  dbHost,
  dbDatabase,
  dbPassword,
  dbPort,
  dbUsername,
  dbSchema,
  azureConnectionString,
  azureContainer,
  azureOpenAIEndpoint,
  azureOpenAIKey,
  azureOpenAIDeployment,
  azureOpenAIApiVersion,
  jwtSecret,
  jwtExpiresIn,
  azureAccountName,
  azureAccountKey,
};
