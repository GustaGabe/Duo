import type { CreateCategoryInput } from '@duo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCategory, deleteCategory, listCategories, updateCategory } from '@/api/categories';

import { queryKeys } from './queries';

export function useCategories(spaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories(spaceId ?? ''),
    queryFn: () => listCategories(spaceId!),
    enabled: Boolean(spaceId),
  });
}

function invalidate(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: ['categories'] });
  void client.invalidateQueries({ queryKey: ['summary'] });
}

export function useCreateCategory() {
  const client = useQueryClient();
  return useMutation({ mutationFn: createCategory, onSuccess: () => invalidate(client) });
}

export function useUpdateCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      spaceId,
      patch,
    }: {
      id: string;
      spaceId: string;
      patch: Partial<CreateCategoryInput>;
    }) => updateCategory(id, spaceId, patch),
    onSuccess: () => invalidate(client),
  });
}

export function useDeleteCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, spaceId }: { id: string; spaceId: string }) => deleteCategory(id, spaceId),
    onSuccess: () => invalidate(client),
  });
}
