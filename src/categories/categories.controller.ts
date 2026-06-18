import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/jwt-payload.interface';
import { ApiStandardErrors } from '../common/swagger/api-error-response.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @InjectPinoLogger(CategoriesController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar categoria',
    description:
      'Cadastra uma nova categoria financeira vinculada ao usuário autenticado. ' +
      'Categorias são usadas para classificar transações de receita e despesa.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({
    type: CategoryEntity,
    description: 'Categoria criada com sucesso',
  })
  @ApiStandardErrors()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    this.logger.info(
      { event: 'categories.create.request', userId: user.id, name: dto.name },
      'Create category request',
    );
    return this.categoriesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar categorias',
    description:
      'Retorna todas as categorias do usuário autenticado, ordenadas alfabeticamente por nome.',
  })
  @ApiOkResponse({
    type: [CategoryEntity],
    description: 'Lista de categorias do usuário',
  })
  @ApiStandardErrors()
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<CategoryEntity[]> {
    this.logger.debug(
      { event: 'categories.findAll.request', userId: user.id },
      'List categories request',
    );
    return this.categoriesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por ID',
    description:
      'Retorna os detalhes de uma categoria específica. ' +
      'Retorna 404 se a categoria não existir ou não pertencer ao usuário.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Identificador único da categoria',
  })
  @ApiOkResponse({ type: CategoryEntity })
  @ApiStandardErrors()
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryEntity> {
    this.logger.debug(
      { event: 'categories.findOne.request', userId: user.id, categoryId: id },
      'Find category request',
    );
    return this.categoriesService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description:
      'Atualiza parcialmente os dados de uma categoria existente. ' +
      'Somente campos enviados no body serão alterados.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ type: CategoryEntity })
  @ApiStandardErrors()
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    this.logger.info(
      { event: 'categories.update.request', userId: user.id, categoryId: id },
      'Update category request',
    );
    return this.categoriesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover categoria',
    description:
      'Exclui permanentemente uma categoria do usuário. ' +
      'Não é possível excluir categorias vinculadas a transações existentes (RESTRICT).',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Categoria removida com sucesso' })
  @ApiStandardErrors()
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    this.logger.info(
      { event: 'categories.delete.request', userId: user.id, categoryId: id },
      'Delete category request',
    );
    await this.categoriesService.remove(user.id, id);
  }
}
