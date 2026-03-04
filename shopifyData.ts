import { shopifyFetch } from "./shopifyFetch";
import type { StoreCollection, StoreProduct } from "./types";

function mapProduct(node: any): StoreProduct {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || "",
    vendor: node.vendor,
    images: (node.images?.nodes || []).map((i: any) => ({ url: i.url, altText: i.altText })),
    variants: (node.variants?.nodes || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: v.price
    })),
    priceRange: node.priceRange,
  };
}

export async function getAllProducts(first = 24): Promise<StoreProduct[]> {
  const data = await shopifyFetch<any>(`#graphql
    query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id handle title description vendor
          images(first: 10) { nodes { url altText } }
          variants(first: 50) { nodes { id title availableForSale price { amount currencyCode } } }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  `, { first });

  return data.products.nodes.map(mapProduct);
}

export async function getCollections(first = 12): Promise<StoreCollection[]> {
  const data = await shopifyFetch<any>(`#graphql
    query Collections($first: Int!) {
      collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
        nodes { id handle title description }
      }
    }
  `, { first });

  return data.collections.nodes as StoreCollection[];
}

export async function getCollectionByHandle(handle: string): Promise<StoreCollection | null> {
  const data = await shopifyFetch<any>(`#graphql
    query Collection($handle: String!) {
      collection(handle: $handle) { id handle title description }
    }
  `, { handle });

  return data.collection ?? null;
}

export async function getProductsByCollectionHandle(handle: string, first = 24): Promise<StoreProduct[]> {
  const data = await shopifyFetch<any>(`#graphql
    query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          nodes {
            id handle title description vendor
            images(first: 10) { nodes { url altText } }
            variants(first: 50) { nodes { id title availableForSale price { amount currencyCode } } }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `, { handle, first });

  return (data.collection?.products?.nodes || []).map(mapProduct);
}

export async function getProductByHandle(handle: string): Promise<StoreProduct | null> {
  const data = await shopifyFetch<any>(`#graphql
    query Product($handle: String!) {
      product(handle: $handle) {
        id handle title description vendor
        images(first: 20) { nodes { url altText } }
        variants(first: 100) { nodes { id title availableForSale price { amount currencyCode } } }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  `, { handle });

  return data.product ? mapProduct(data.product) : null;
}

export async function getFeaturedCollection(): Promise<StoreCollection | null> {
  const handle = process.env.NEXT_PUBLIC_FEATURED_COLLECTION_HANDLE || "new-in";
  return getCollectionByHandle(handle);
}

export async function getProductsFromFeaturedCollection(first = 8): Promise<StoreProduct[]> {
  const handle = process.env.NEXT_PUBLIC_FEATURED_COLLECTION_HANDLE || "new-in";
  try {
    const products = await getProductsByCollectionHandle(handle, first);
    if (products.length) return products;
  } catch {}
  // fallback
  return getAllProducts(first);
}
