export type ServerSuggestion = {
  id: number;
  user_id: number;
  suggestion: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  comments: string;
};

export type Suggestion = {
  id: number;
  userId: number;
  createdAt: string;    
  updatedAt: string;
  completedAt: string;
  suggestion: string;
  comments: string;
};
