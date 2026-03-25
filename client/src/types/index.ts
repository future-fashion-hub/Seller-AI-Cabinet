export type ItemCategory = 'auto' | 'real_estate' | 'electronics';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export type Item = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  category: ItemCategory;
  title: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};

export type ItemWithRevision = Item & {
  needsRevision: boolean;
};

export type ItemsGetOut = {
  items: ItemWithRevision[];
  total: number;
};

export type ItemUpdateIn = {
  category: ItemCategory;
  title: string;
  description?: string;
  price: number;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};
