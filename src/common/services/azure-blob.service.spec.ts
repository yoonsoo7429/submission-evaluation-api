import { AzureBlobService } from './azure-blob.service';
import { ConfigService } from '@nestjs/config';
import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
} from '@azure/storage-blob';

jest.mock('@azure/storage-blob', () => {
  const originalModule = jest.requireActual('@azure/storage-blob');
  return {
    __esModule: true,
    ...originalModule,
    BlobServiceClient: {
      fromConnectionString: jest.fn(),
    },
    generateBlobSASQueryParameters: jest.fn().mockReturnValue({
      toString: () => 'dummy-sas-token',
    }),
    BlobSASPermissions: {
      parse: jest.fn().mockReturnValue('r'),
    },
    StorageSharedKeyCredential: jest.fn(),
  };
});

describe('AzureBlobService', () => {
  let service: AzureBlobService;
  let configService: ConfigService;
  let mockContainerClient: jest.Mocked<ContainerClient>;
  let mockBlockBlobClient: jest.Mocked<BlockBlobClient>;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('dummy-value'),
    } as any;

    mockBlockBlobClient = {
      uploadFile: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockContainerClient = {
      getBlockBlobClient: jest.fn().mockReturnValue(mockBlockBlobClient),
    } as any;

    (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    } as any);

    service = new AzureBlobService(configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('uploadFile should upload and return URL', async () => {
    const result = await service.uploadFile('dummy-path/test.txt', 'test.txt');

    expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
      'test.txt',
    );
    expect(mockBlockBlobClient.uploadFile).toHaveBeenCalledWith(
      'dummy-path/test.txt',
    );
    expect(typeof result).toBe('string');
    expect(result).toContain('https://');
    expect(result).toContain('?');
  });

  it('generateSasUrl should return URL', async () => {
    const result = await service.generateSasUrl('test.txt');
    expect(typeof result).toBe('string');
    expect(result).toContain('https://');
    expect(result).toContain('?');
  });
});
