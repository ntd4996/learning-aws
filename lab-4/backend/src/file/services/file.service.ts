import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Hash } from '@aws-sdk/hash-node';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { parseUrl } from '@aws-sdk/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('app.aws.s3.region'),
      credentials: {
        accessKeyId: configService.get('app.aws.accessKeyId'),
        secretAccessKey: configService.get('app.aws.secretAccessKey'),
      },
    });
  }

  async signedUrl(objectUrl: string) {
    const s3ObjectUrl = parseUrl(objectUrl);
    const presigner = new S3RequestPresigner({
      credentials: {
        accessKeyId: this.configService.get('app.aws.accessKeyId'),
        secretAccessKey: this.configService.get('app.aws.secretAccessKey'),
      },
      region: this.configService.get('app.aws.s3.region'),
      sha256: Hash.bind(null, 'sha256'),
    });

    const url = await presigner.presign(new HttpRequest(s3ObjectUrl));

    return formatUrl(url);
  }

  async upload(body: PutObjectCommandInput['Body'], key: string) {
    const bucket = this.configService.get('app.aws.s3.bucket');

    const command = new PutObjectCommand({
      Body: body,
      Key: key,
      Bucket: bucket,
    });

    await this.s3Client.send(command);
    return this.genS3Url(bucket, key);
  }

  async genS3Url(bucket: string, key: string) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
