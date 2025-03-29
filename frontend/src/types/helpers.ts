import { Order } from "./order.types";
import { ServerOrder } from "./order.types";
import { Request } from "./request.types";
import { ServerRequest } from "./request.types";
import { Suggestion } from "./suggestion.types";
import { ServerSuggestion } from "./suggestion.types";

export const parseServerSuggestion = (
  serverSuggestion: ServerSuggestion
): Suggestion => {
  return {
    ...serverSuggestion,
    userId: serverSuggestion.user_id,
    createdAt: serverSuggestion.created_at,
    updatedAt: serverSuggestion.updated_at,
    completedAt: serverSuggestion.completed_at,
  };
};

export const parseServerOrder = (serverOrder: ServerOrder): Order => {
  return {
    ...serverOrder,
    userId: serverOrder.user_id,
    createdAt: serverOrder.created_at,
    updatedAt: serverOrder.updated_at,
    completedAt: serverOrder.completed_at,
  };
};

export const parseServerRequest = (serverRequest: ServerRequest): Request => {
  return {
    ...serverRequest,
    createdAt: serverRequest.created_at,
    updatedAt: serverRequest.updated_at,
    userId: serverRequest.user_id,
    orderId: serverRequest.order_id,
  };
};
