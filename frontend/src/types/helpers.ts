import { Order } from "./order.types";
import { ServerOrder } from "./order.types";
import { Request } from "./request.types";
import { ServerRequest } from "./request.types";
import { Status } from "./status.enum";
import { Suggestion } from "./suggestion.types";
import { ServerSuggestion } from "./suggestion.types";

export const parseServerSuggestion = (
  serverSuggestion: ServerSuggestion[]
): Suggestion[] => {
  return serverSuggestion.map((suggestion) => ({
    ...suggestion,
    userId: suggestion.user_id,
    createdAt: suggestion.created_at,
    updatedAt: suggestion.updated_at,
    completedAt: suggestion.completed_at,
    userName: suggestion.user_name,
    isAnonymous: suggestion.is_anonymous,
  }));
};

export const parseClientSuggestion = (
  clientSuggestion: Suggestion
): Partial<ServerSuggestion> => {
  return {
    id: clientSuggestion.id,
    suggestion: clientSuggestion.suggestion,
    user_id: clientSuggestion.userId,
    user_name: clientSuggestion.userName,
    is_anonymous: clientSuggestion.isAnonymous,
    created_at: clientSuggestion.createdAt,
    updated_at: clientSuggestion.updatedAt,
    completed_at: clientSuggestion.completedAt,
    comments: clientSuggestion.comments,
  };
};

export const parseServerOrder = (serverOrder: ServerOrder): Order => {
  return {
    ...serverOrder,
    userId: serverOrder.user_id,
    createdAt: serverOrder.created_at,
    updatedAt: serverOrder.updated_at,
    completedAt: serverOrder.completed_at,
    userName: serverOrder.user_name,
  };
};

export const parseServerRequest = (
  serverRequest: ServerRequest[]
): Request[] => {
  return serverRequest.map((request) => ({
    ...request,
    status: request.status as Status,
    createdAt: request.created_at,
    updatedAt: request.updated_at,
    userId: request.user_id,
    orderId: request.order_id,
    userName: request.user_name,
    requestType: request.request_type,
    adminName: request.admin_name,
    cost: request.cost,
    requestedAmount: request.requested_amount,
    orderedAmount: request.ordered_amount,
    itemName: request.item_name,
    isAnonymous: request.is_anonymous,
  }));
};

export const parseClientRequest = (
  clientRequest: Request
): Partial<ServerRequest> => {
  return {
    id: clientRequest.id,
    status: clientRequest.status,
    user_id: clientRequest.userId,
    user_name: clientRequest.userName,
    request_type: clientRequest.requestType,
    order_id: clientRequest.orderId,
    created_at: clientRequest.createdAt,
    updated_at: clientRequest.updatedAt,
    admin_name: clientRequest.adminName,
    cost: clientRequest.cost,
    requested_amount: clientRequest.requestedAmount,
    ordered_amount: clientRequest.orderedAmount,
    item_name: clientRequest.itemName,
    request: clientRequest.request,
  };
};
