import type { Category, CreateCategoryInput } from '@duo/shared';

import { db, nextId } from './mock-db';
import { mockRequest } from './client';

export function listCategories(spaceId: string): Promise<Category[]> {
  return mockRequest(() => db.categories.filter((category) => category.spaceId === spaceId));
}

export function createCategory(input: CreateCategoryInput): Promise<Category> {
  return mockRequest(() => {
    const category: Category = { ...input, id: nextId('cat') };
    db.categories = [...db.categories, category];
    return category;
  });
}

export function updateCategory(id: string, patch: Partial<CreateCategoryInput>): Promise<Category> {
  return mockRequest(() => {
    const index = db.categories.findIndex((category) => category.id === id);
    if (index < 0) throw new Error(`Category ${id} not found.`);
    const updated = { ...db.categories[index]!, ...patch };
    db.categories = db.categories.with(index, updated);
    return updated;
  });
}

export function deleteCategory(id: string): Promise<void> {
  return mockRequest(() => {
    db.categories = db.categories.filter((category) => category.id !== id);
  });
}
