import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export const appConfig = registerAs('app', () => {
  return {
    aws: {
      accessKeyId: get('AWS_ACCESS_KEY_ID').required().asString(),
      secretAccessKey: get('AWS_SECRET_ACCESS_KEY').required().asString(),

      s3: {
        region: get('AWS_S3_REGION').required().asString(),
        bucket: get('AWS_S3_BUCKET').required().asString(),
      },
    },
  };
});
