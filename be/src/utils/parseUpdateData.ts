import { Prisma } from '@prisma/client';

type TransformMap<T> = Partial<{
  [K in keyof T]: (value: T[K]) => any;
}>;

export function ParseUpdateData<T extends Record<string, any>>(
  body: Partial<T>,
  transform?: TransformMap<T>,
): Prisma.ChildUpdateInput {
  const data: Prisma.ChildUpdateInput = {};

  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;

    const transformer = transform?.[key as keyof T];
    const finalValue = transformer ? transformer(value as any) : value;

    (data as any)[key] = finalValue;
  });

  return data;
}
