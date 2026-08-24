import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ResponseUtil } from '@/apps/api/common/utils/response';

const imageTypes = {
  'image/jpeg': {
    extension: 'jpg',
    matches: (buffer: Buffer) => buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
  },
  'image/png': {
    extension: 'png',
    matches: (buffer: Buffer) =>
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  'image/webp': {
    extension: 'webp',
    matches: (buffer: Buffer) =>
      buffer.subarray(0, 4).equals(Buffer.from('RIFF')) &&
      buffer.subarray(8, 12).equals(Buffer.from('WEBP')),
  },
  'image/gif': {
    extension: 'gif',
    matches: (buffer: Buffer) => ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString()),
  },
} as const;

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async saveImage(file: UploadedImageFile) {
    const imageType = imageTypes[file.mimetype as keyof typeof imageTypes];

    if (!imageType || !imageType.matches(file.buffer)) {
      throw new BadRequestException('Nội dung tệp không phải là ảnh hợp lệ');
    }

    const filename = `${randomUUID()}.${imageType.extension}`;
    const relativePath = `/uploads/images/${filename}`;
    const directory = join(process.cwd(), 'public', 'uploads', 'images');

    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, filename), file.buffer);

    const appUrl = this.configService.getOrThrow<string>('app.url').replace(/\/$/, '');

    return ResponseUtil.success({
      filename,
      path: relativePath,
      url: `${appUrl}${relativePath}`,
    });
  }
}

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
}
