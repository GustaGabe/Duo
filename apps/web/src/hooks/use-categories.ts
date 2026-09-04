import type { CreateCategoryInput } from '@duo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCategory, deleteCategory, listCategories, updateCategory } from '@/api/categories';

import { queryKeys } from './queries';

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: listCategories });
}

export function useCreateCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

export function useUpdateCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<CreateCategoryInput> }) =>
      updateCategory(id, patch),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

export function useDeleteCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}
