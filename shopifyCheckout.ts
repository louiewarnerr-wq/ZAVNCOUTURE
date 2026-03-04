import { shopifyFetch } from "./shopifyFetch";
import type { CartLine } from "./types";

type Checkout = {
  id: string;
  webUrl: string;
  lineItems: { edges: any[] };
  subtotalPriceV2: { amount: string; currencyCode: string };
};

function money(m: { amount: string; currencyCode: string }) {
  return `${m.amount} ${m.currencyCode}`;
}

function mapLines(edges: any[]): CartLine[] {
  return edges.map((e: any) => {
    const li = e.node;
    const variant = li.variant;
    const imageUrl = variant?.image?.url ?? variant?.product?.images?.nodes?.[0]?.url ?? null;
    const title = variant?.product?.title ?? "Item";
    const variantTitle = variant?.title ?? null;
    const lineTotal = money(li.discountedTotalPriceV2 ?? li.linePriceV2 ?? li.originalTotalPriceV2);
    return {
      id: li.id,
      title,
      variantTitle,
      quantity: li.quantity,
      imageUrl,
      lineTotal,
    };
  });
}

export async function createCheckout() {
  const data = await shopifyFetch<any>(`#graphql
    mutation CreateCheckout {
      checkoutCreate(input: {}) {
        checkout {
          id
          webUrl
          subtotalPriceV2 { amount currencyCode }
          lineItems(first: 50) {
            edges {
              node {
                id
                title
                quantity
                discountedTotalPriceV2 { amount currencyCode }
                variant {
                  id
                  title
                  image { url }
                  product {
                    title
                    images(first: 1) { nodes { url } }
                  }
                }
              }
            }
          }
        }
        checkoutUserErrors { message }
      }
    }
  `);

  const co: Checkout = data.checkoutCreate.checkout;
  return {
    id: co.id,
    checkoutUrl: co.webUrl,
    lines: mapLines(co.lineItems.edges),
    subtotal: money(co.subtotalPriceV2),
  };
}

export async function addLinesToCheckout(checkoutId: string, lines: { variantId: string; quantity: number }[]) {
  const data = await shopifyFetch<any>(`#graphql
    mutation AddLine($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout { id }
        checkoutUserErrors { message }
      }
    }
  `, { checkoutId, lineItems: lines });

  const errs = data.checkoutLineItemsAdd.checkoutUserErrors;
  if (errs?.length) throw new Error(errs.map((e: any) => e.message).join("; "));
}

export async function updateLineQty(checkoutId: string, lineId: string, quantity: number) {
  const data = await shopifyFetch<any>(`#graphql
    mutation UpdateLine($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
      checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout { id }
        checkoutUserErrors { message }
      }
    }
  `, { checkoutId, lineItems: [{ id: lineId, quantity }] });

  const errs = data.checkoutLineItemsUpdate.checkoutUserErrors;
  if (errs?.length) throw new Error(errs.map((e: any) => e.message).join("; "));
}

export async function removeLine(checkoutId: string, lineId: string) {
  const data = await shopifyFetch<any>(`#graphql
    mutation RemoveLine($checkoutId: ID!, $lineItemIds: [ID!]!) {
      checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
        checkout { id }
        checkoutUserErrors { message }
      }
    }
  `, { checkoutId, lineItemIds: [lineId] });

  const errs = data.checkoutLineItemsRemove.checkoutUserErrors;
  if (errs?.length) throw new Error(errs.map((e: any) => e.message).join("; "));
}

export async function getCheckout(checkoutId: string) {
  const data = await shopifyFetch<any>(`#graphql
    query GetCheckout($checkoutId: ID!) {
      node(id: $checkoutId) {
        ... on Checkout {
          id
          webUrl
          subtotalPriceV2 { amount currencyCode }
          lineItems(first: 50) {
            edges {
              node {
                id
                title
                quantity
                discountedTotalPriceV2 { amount currencyCode }
                variant {
                  id
                  title
                  image { url }
                  product {
                    title
                    images(first: 1) { nodes { url } }
                  }
                }
              }
            }
          }
        }
      }
    }
  `, { checkoutId });

  const co: Checkout = data.node;
  return {
    id: co.id,
    checkoutUrl: co.webUrl,
    lines: mapLines(co.lineItems.edges),
    subtotal: money(co.subtotalPriceV2),
  };
}
