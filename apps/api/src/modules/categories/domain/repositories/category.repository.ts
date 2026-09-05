import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract create(category: Category): Promise<void>;

  abstract findById(id: string): Promise<Category | null>;

  abstract findBySpaceId(spaceId: string): Promise<Category[]>;

  abstract update(category: Category): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
