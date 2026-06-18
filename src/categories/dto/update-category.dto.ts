import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ example: 'Updated category name' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;
}
