import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ContactStatus, ContentKind } from './database/entities';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100000) page = 1;
  @ApiPropertyOptional({ default: 20, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
export class ContentQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ContentKind }) @IsOptional() @IsEnum(ContentKind) kind?: ContentKind;
}
export class LoginDto {
  @ApiProperty() @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value) @IsEmail() @MaxLength(254) email!: string;
  @ApiProperty() @IsString() @Length(1, 72) password!: string;
}
export class CreateContentDto {
  @ApiProperty({ enum: ContentKind }) @IsEnum(ContentKind) kind!: ContentKind;
  @ApiProperty() @IsString() @Length(1, 200) title!: string;
  @ApiProperty() @IsString() @Length(1, 200) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) slug!: string;
  @ApiProperty() @IsString() @Length(1, 1000) summary!: string;
  @ApiProperty() @IsString() @Length(1, 50000) body!: string;
  @ApiPropertyOptional({ default: false }) @ValidateIf((_, value) => value !== undefined) @IsBoolean() published?: boolean;
}
export class UpdateContentDto extends PartialType(CreateContentDto, { skipNullProperties: false }) {}
export class CreateContactDto {
  @ApiProperty() @IsString() @Length(1, 120) name!: string;
  @ApiProperty() @IsEmail() @MaxLength(254) email!: string;
  @ApiProperty() @IsString() @Length(1, 200) subject!: string;
  @ApiProperty() @IsString() @Length(1, 5000) message!: string;
}
export class UpdateContactDto {
  @ApiProperty({ enum: ContactStatus }) @IsEnum(ContactStatus) status!: ContactStatus;
}
