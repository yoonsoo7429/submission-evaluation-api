// src/azure/azure-blob.service.ts
import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class AzureBlobService {
  private containerClient;

  constructor(private configService: ConfigService) {
    const blobService = BlobServiceClient.fromConnectionString(
      configService.get('AZURE_CONNECTION_STRING'),
    );
    this.containerClient = blobService.getContainerClient(
      configService.get('AZURE_CONTAINER'),
    );
  }

  async uploadFile(localPath: string, fileName: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadFile(localPath);
    return blockBlobClient.url;
  }
}
