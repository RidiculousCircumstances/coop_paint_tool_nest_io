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
    const contextHttp = context.switchToHttp();
    const fiiles = contextHttp.getRequest().files;

    if (!fiiles || fiiles.length === 0) {
      return next.handle();
    }

    const fileNames = [];
    await Promise.all(
      fiiles.map(async (file) => {
        const buffer = file.buffer;
        const filename = setFileNameWithExt('.webp');
        await sharp(buffer)
          .webp()
          .toFile(
            `${join(this.configService.get<string>('IMAGES_DEST'), filename)}`,
          );
        fileNames.push(filename);
      }),
    );
    context.getArgByIndex(0).files = fileNames;
    return next.handle();
  }
}
