// src/utils/pagination.ts
export const paginate = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

// Usage in your query
const { limit, offset } = paginate(1, 10); // Example: page 1, 10 items per page
