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
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../../auth/http/decorators/current-user.decorator';
import { SpaceMemberGuard } from '../../../spaces/http/guards/space-member.guard';
import { User } from '../../../users/domain/entities/user.entity';
import {
  CreateCategoryDto,
  ListCategoriesDto,
} from '../../application/dto/category.dto';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';
import type { UpdateCategoryInput } from '../../application/use-cases/update-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';

@Controller('categories')
@UseGuards(SpaceMemberGuard)
export class CategoriesController {
  constructor(
    private readonly listCategories: ListCategoriesUseCase,
    private readonly createCategory: CreateCategoryUseCase,
    private readonly updateCategory: UpdateCategoryUseCase,
    private readonly deleteCategory: DeleteCategoryUseCase,
  ) {}

  @Get()
  list(@Query() query: ListCategoriesDto) {
    return this.listCategories.execute(query.spaceId);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: User) {
    return this.createCategory.execute({
      spaceId: dto.spaceId,
      name: dto.name,
      tag: dto.tag,
      description: dto.description,
      kind: dto.kind,
      color: dto.color,
      monthlyLimitCents: dto.monthlyLimitCents ?? null,
      scope: dto.scope,
      ownerId: user.id,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListCategoriesDto,
    @Body() patch: UpdateCategoryInput,
  ) {
    return this.updateCategory.execute(id, query.spaceId, patch);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ListCategoriesDto,
  ) {
    await this.deleteCategory.execute(id, query.spaceId);
  }
}
