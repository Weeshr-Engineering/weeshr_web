export interface BasketItem {
  id: string; // Use string to match MongoDB _id
  qty: number;
  name?: string;
}
