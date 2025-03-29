import { Status } from "./status.enum";

export type ServerRequest = {
  id: number;
  status: Status;
  user_id: number;
  request: string;
  request_type: string;
  order_id: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  admin: number;
  admin_name: string;
  cost: number;
};

export type Request = {
  id: number;
  status: Status;
  userId: number;
  request: string;
  requestType: string;
  orderId: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  admin: number;
  adminName: string;
  cost: number;
};
