import type { Category, CreateCategoryInput } from '@duo/shared';

import { request } from './http';

export function listCategories(spaceId: string): Promise<Category[]> {
  return request<Category[]>(`/categories?spaceId=${encodeURIComponent(spaceId)}`);
}

export function createCategory(input: CreateCategoryInput): Promise<Category> {
  return request<Category>('/categories', { method: 'POST', body: input });
}

export function updateCategory(
  id: string,
  spaceId: string,
  patch: Partial<CreateCategoryInput>,
): Promise<Category> {
  return request<Category>(`/categories/${id}?spaceId=${encodeURIComponent(spaceId)}`, {
    method: 'PATCH',
    body: patch,
  });
}

export function deleteCategory(id: string, spaceId: string): Promise<void> {
  return request<void>(`/categories/${id}?spaceId=${encodeURIComponent(spaceId)}`, {
    method: 'DELETE',
  });
}
