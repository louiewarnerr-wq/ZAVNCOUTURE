export type Money = {
  amount: string;
  currencyCode: string;
};

export type StoreImage = {
  url: string;
  altText?: string | null;
};

export type StoreVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
};

export type StoreProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor?: string;
  images: StoreImage[];
  variants: StoreVariant[];
  priceRange: {
    minVariantPrice: Money;
  };
};

export type StoreCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
};

export type CartLine = {
  id: string;
  title: string;
  variantTitle?: string | null;
  quantity: number;
  imageUrl?: string | null;
  lineTotal: string;
};
