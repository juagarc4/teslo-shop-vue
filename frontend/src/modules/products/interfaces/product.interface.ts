import type { User } from '@/modules/auth/interfaces/user.interface';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: string;
  tags: string[];
  images: string[];
  user: User;
}

export enum Size {
  l = 'L',
  m = 'M',
  s = 'S',
  xl = 'XL',
  xs = 'XS',
  xxl = 'XXL',
}
