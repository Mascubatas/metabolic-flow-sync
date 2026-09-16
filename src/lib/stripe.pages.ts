export const PRODUCT_PRICE_USD = 2900;

export async function createCheckoutSession(): Promise<never> {
  throw new Error("Stripe checkout is unavailable in the GitHub Pages build.");
}