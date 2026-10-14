export interface Page<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export function paginate<T>(items: T[], page: number, limit: number): Page<T> {
  const start = (page - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total_items: items.length,
      total_pages: Math.ceil(items.length / limit),
    },
  };
}
