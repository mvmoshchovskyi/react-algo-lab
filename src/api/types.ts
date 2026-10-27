export type Product = {
  minPrice: number | null;
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  thumbnail?: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Category = {
  slug: string;
  name: string;
};

export type FlatComment = {
  id: number;
  parentId: number | null;
  author: string;
  text: string;
  createdAt: string;
  likes: number;
};

export type SortDirection = "asc" | "desc";
