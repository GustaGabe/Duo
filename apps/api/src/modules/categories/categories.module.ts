import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpacesModule } from '../spaces/spaces.module';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { CategoryRepository } from './domain/repositories/category.repository';
import { CategoriesController } from './http/controllers/categories.controller';
import { CategoryOrmEntity } from './infrastructure/persistence/typeorm/category.orm-entity';
import { CategoryTypeOrmRepository } from './infrastructure/persistence/typeorm/category-typeorm.repository';

@Module({
  imports: [SpacesModule, TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoriesController],
  providers: [
    { provide: CategoryRepository, useClass: CategoryTypeOrmRepository },
    ListCategoriesUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  exports: [CategoryRepository],
})
export class CategoriesModule {}
