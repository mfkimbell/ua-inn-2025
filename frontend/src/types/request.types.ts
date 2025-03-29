export type ServerRequest = {
  id: number;
  status: string;
  user_id: number;
  request: string;
  request_type: string;
  order_id: number;
  created_at: string;
  updated_at: string;
  user_name: string;
};

export type Request = {
  id: number;
  status: string;
  userId: number;
  request: string;
  request_type: string;
  orderId: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
};
