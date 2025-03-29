export type ServerRequest = {
  id: number;
  user_id: number;
  request: string;
  order_id: number;
  created_at: string;
  updated_at: string;
};

export type Request = {
  id: number;
  userId: number;
  request: string;
  orderId: number;
  createdAt: string;
  updatedAt: string;
};
