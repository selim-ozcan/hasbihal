import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadOptions } from './file-upload-options.interface';

@Injectable()
export class S3Service {
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = configService.get('AWS_ACCESS_KEY');
    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');

    const s3ClientConfig: S3ClientConfig = {};

    if (accessKeyId && secretAccessKey) {
      s3ClientConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
      s3ClientConfig.region = 'eu-north-1';
    }

    this.client = new S3Client(s3ClientConfig);
  }

  async upload({ bucket, key, file }: FileUploadOptions) {
    try {
      await this.client.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: file }),
      );
    } catch (error) {
      console.log('Error ', error);
    }
  }

  getObjectUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
