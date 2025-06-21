export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: number;
    name: string;
    phone: string;
    table: string;
    items: OrderItem[];
    total: number;
    createdAt: string;
  }
  
  export const orders: Order[] = [];
  