import * as Minio from 'minio';

const s3Host = process.env.S3_HOST ?? 'localhost';
const s3Port = process.env.S3_PORT ? parseInt(process.env.S3_PORT, 10) : 9000;
const s3UseSSL = process.env.S3_USE_SSL ? process.env.S3_USE_SSL === 'true' : false;

export const s3client = new Minio.Client({
    endPoint: s3Host,
    port: s3Port,
    useSSL: s3UseSSL,
    accessKey: process.env.S3_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.S3_SECRET_KEY ?? 'minioadmin',
});

export const s3bucket = process.env.S3_BUCKET ?? 'happy-server';

export const s3host = process.env.S3_HOST ?? 'localhost';

export const s3public = process.env.S3_PUBLIC_URL ?? `http${s3UseSSL ? 's' : ''}://${s3host}:${s3Port}`;

export async function loadFiles() {
    try {
        await s3client.bucketExists(s3bucket);
    } catch (error) {
        console.warn(`⚠️  S3/Minio not available at ${s3Host}:${s3Port}. File storage features will be disabled.`);
        console.warn('   Start Minio with: yarn s3 && yarn s3:init');
    }
}

export function getPublicUrl(path: string) {
    return `${s3public}/${path}`;
}

export type ImageRef = {
    width: number;
    height: number;
    thumbhash: string;
    path: string;
}
