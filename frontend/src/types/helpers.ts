import { Order } from "./order.types";
import { ServerOrder } from "./order.types";
import { Request } from "./request.types";
import { ServerRequest } from "./request.types";
import { Status } from "./status.enum";
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
    userName: serverSuggestion.user_name,
    isAnonymous: serverSuggestion.is_anonymous,
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
