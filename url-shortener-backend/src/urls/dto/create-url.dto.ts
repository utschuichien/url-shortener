import { IsNotEmpty, IsUrl, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL không hợp lệ' })
  @IsNotEmpty({ message: 'URL không được để trống' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(15, { message: 'Tên tùy chỉnh tối đa 15 ký tự' })
  @Matches(/^[a-zA-Z0-9_-]*$/, { message: 'Tên tùy chỉnh chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới' })
  customAlias?: string;
}
