import { Injectable } from '@nestjs/common';
import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { envVariables } from '../const/env.const';

@Injectable()
export class AzureBlobService {
  private containerClient;
  private accountName: string;
  private accountKey: string;
  private containerName: string;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      envVariables.azureConnectionString,
    );
    const blobService =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = this.configService.get<string>(
      envVariables.azureContainer,
    );
    this.containerClient = blobService.getContainerClient(this.containerName);
    this.accountName = this.configService.get<string>(
      envVariables.azureAccountName,
    );
    this.accountKey = this.configService.get<string>(
      envVariables.azureAccountKey,
    );
  }

  async uploadFile(localPath: string, fileName: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadFile(localPath);

    const sasUrl = await this.generateSasUrl(fileName);
    return sasUrl;
  }

  async generateSasUrl(blobName: string): Promise<string> {
    const credential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey,
    );

    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000);
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: blobName,
        expiresOn,
        permissions: BlobSASPermissions.parse('r'),
      },
      credential,
    ).toString();

    const blobUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${blobName}`;
    return `${blobUrl}?${sasToken}`;
  }
}
