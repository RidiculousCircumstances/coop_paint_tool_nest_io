import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { map, Observable } from 'rxjs';
import * as sharp from 'sharp';
import { setFileNameWithExt } from 'src/uploading/setFileNameWithExt';

@Injectable()
export class WebpInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const buffer = context.getArgByIndex(0).file.buffer;
    const filename = setFileNameWithExt('.webp');
    await sharp(buffer)
      .webp()
      .toFile(
        `${join(this.configService.get<string>('IMAGES_DEST'), filename)}`,
      );
    context.getArgByIndex(0).file.filename = filename;
    return next.handle();
  }
}
