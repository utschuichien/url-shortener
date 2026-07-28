import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @IsUrl({}, { message: 'URL không hợp lệ' })
  @IsNotEmpty({ message: 'URL không được để trống' })
  originalUrl: string;
}
