import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FilesValidator implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const a = 1;
  }
}
