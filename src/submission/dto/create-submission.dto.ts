import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ComponentType } from 'src/common/enum/component-type.enum';

export class CreateSubmissionDto {
  @ApiProperty({
    example: 'I want to improve my English writing.',
    description: '학생이 제출한 에세이 텍스트',
  })
  @IsString()
  @IsNotEmpty()
  submitText: string;

  @ApiProperty({
    enum: ComponentType,
    description: '평가 영역 타입 (에세이, 말하기)',
  })
  @IsEnum(ComponentType)
  componentType: ComponentType;
}
