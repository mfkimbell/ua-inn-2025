export type ServerOrder = {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  user_name: string;
  cost: number;
};

export type Order = {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  userName: string;
  cost: number;
};
