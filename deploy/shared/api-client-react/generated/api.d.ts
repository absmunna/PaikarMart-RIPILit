import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminDashboard, CategoryListResponse, CreateOrderBody, HealthStatus, ListNotificationsParams, ListOrdersParams, ListProductsParams, ListSellersParams, MarketStats, Notification, NotificationListResponse, Order, OrderListResponse, Product, ProductListResponse, Seller, SellerDashboard, SellerListResponse, SellerRegistrationBody, UpdateOrderStatusBody, User, Wallet } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all products
 */
export declare const getListProductsUrl: (params?: ListProductsParams) => string;
export declare const listProducts: (params?: ListProductsParams, options?: RequestInit) => Promise<ProductListResponse>;
export declare const getListProductsQueryKey: (params?: ListProductsParams) => readonly ["/api/products", ...ListProductsParams[]];
export declare const getListProductsQueryOptions: <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
/**
 * @summary List all products
 */
export declare function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get product by ID
 */
export declare const getGetProductUrl: (id: string) => string;
export declare const getProduct: (id: string, options?: RequestInit) => Promise<Product>;
export declare const getGetProductQueryKey: (id: string) => readonly [`/api/products/${string}`];
export declare const getGetProductQueryOptions: <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<void>;
/**
 * @summary Get product by ID
 */
export declare function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get featured products
 */
export declare const getGetFeaturedProductsUrl: () => string;
export declare const getFeaturedProducts: (options?: RequestInit) => Promise<ProductListResponse>;
export declare const getGetFeaturedProductsQueryKey: () => readonly ["/api/products/featured"];
export declare const getGetFeaturedProductsQueryOptions: <TData = Awaited<ReturnType<typeof getFeaturedProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeaturedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedProducts>>>;
export type GetFeaturedProductsQueryError = ErrorType<unknown>;
/**
 * @summary Get featured products
 */
export declare function useGetFeaturedProducts<TData = Awaited<ReturnType<typeof getFeaturedProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get product categories
 */
export declare const getGetCategoriesUrl: () => string;
export declare const getCategories: (options?: RequestInit) => Promise<CategoryListResponse>;
export declare const getGetCategoriesQueryKey: () => readonly ["/api/products/categories"];
export declare const getGetCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof getCategories>>>;
export type GetCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary Get product categories
 */
export declare function useGetCategories<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all sellers
 */
export declare const getListSellersUrl: (params?: ListSellersParams) => string;
export declare const listSellers: (params?: ListSellersParams, options?: RequestInit) => Promise<SellerListResponse>;
export declare const getListSellersQueryKey: (params?: ListSellersParams) => readonly ["/api/sellers", ...ListSellersParams[]];
export declare const getListSellersQueryOptions: <TData = Awaited<ReturnType<typeof listSellers>>, TError = ErrorType<unknown>>(params?: ListSellersParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listSellers>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSellers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSellersQueryResult = NonNullable<Awaited<ReturnType<typeof listSellers>>>;
export type ListSellersQueryError = ErrorType<unknown>;
/**
 * @summary List all sellers
 */
export declare function useListSellers<TData = Awaited<ReturnType<typeof listSellers>>, TError = ErrorType<unknown>>(params?: ListSellersParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listSellers>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get seller by ID
 */
export declare const getGetSellerUrl: (id: string) => string;
export declare const getSeller: (id: string, options?: RequestInit) => Promise<Seller>;
export declare const getGetSellerQueryKey: (id: string) => readonly [`/api/sellers/${string}`];
export declare const getGetSellerQueryOptions: <TData = Awaited<ReturnType<typeof getSeller>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSeller>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSeller>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSellerQueryResult = NonNullable<Awaited<ReturnType<typeof getSeller>>>;
export type GetSellerQueryError = ErrorType<unknown>;
/**
 * @summary Get seller by ID
 */
export declare function useGetSeller<TData = Awaited<ReturnType<typeof getSeller>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSeller>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get products by seller
 */
export declare const getGetSellerProductsUrl: (id: string) => string;
export declare const getSellerProducts: (id: string, options?: RequestInit) => Promise<ProductListResponse>;
export declare const getGetSellerProductsQueryKey: (id: string) => readonly [`/api/sellers/${string}/products`];
export declare const getGetSellerProductsQueryOptions: <TData = Awaited<ReturnType<typeof getSellerProducts>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSellerProducts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSellerProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSellerProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getSellerProducts>>>;
export type GetSellerProductsQueryError = ErrorType<unknown>;
/**
 * @summary Get products by seller
 */
export declare function useGetSellerProducts<TData = Awaited<ReturnType<typeof getSellerProducts>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSellerProducts>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register as seller
 */
export declare const getRegisterSellerUrl: (id: string) => string;
export declare const registerSeller: (id: string, sellerRegistrationBody: SellerRegistrationBody, options?: RequestInit) => Promise<Seller>;
export declare const getRegisterSellerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerSeller>>, TError, {
        id: string;
        data: BodyType<SellerRegistrationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerSeller>>, TError, {
    id: string;
    data: BodyType<SellerRegistrationBody>;
}, TContext>;
export type RegisterSellerMutationResult = NonNullable<Awaited<ReturnType<typeof registerSeller>>>;
export type RegisterSellerMutationBody = BodyType<SellerRegistrationBody>;
export type RegisterSellerMutationError = ErrorType<unknown>;
/**
 * @summary Register as seller
 */
export declare const useRegisterSeller: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerSeller>>, TError, {
        id: string;
        data: BodyType<SellerRegistrationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof registerSeller>>, TError, {
    id: string;
    data: BodyType<SellerRegistrationBody>;
}, TContext>;
/**
 * @summary Approve seller (admin)
 */
export declare const getApproveSellerUrl: (id: string) => string;
export declare const approveSeller: (id: string, options?: RequestInit) => Promise<Seller>;
export declare const getApproveSellerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveSeller>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof approveSeller>>, TError, {
    id: string;
}, TContext>;
export type ApproveSellerMutationResult = NonNullable<Awaited<ReturnType<typeof approveSeller>>>;
export type ApproveSellerMutationError = ErrorType<unknown>;
/**
 * @summary Approve seller (admin)
 */
export declare const useApproveSeller: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveSeller>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof approveSeller>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Get seller dashboard stats
 */
export declare const getGetSellerDashboardUrl: (id: string) => string;
export declare const getSellerDashboard: (id: string, options?: RequestInit) => Promise<SellerDashboard>;
export declare const getGetSellerDashboardQueryKey: (id: string) => readonly [`/api/sellers/${string}/dashboard`];
export declare const getGetSellerDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getSellerDashboard>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSellerDashboard>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSellerDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSellerDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getSellerDashboard>>>;
export type GetSellerDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get seller dashboard stats
 */
export declare function useGetSellerDashboard<TData = Awaited<ReturnType<typeof getSellerDashboard>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSellerDashboard>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List orders
 */
export declare const getListOrdersUrl: (params?: ListOrdersParams) => string;
export declare const listOrders: (params?: ListOrdersParams, options?: RequestInit) => Promise<OrderListResponse>;
export declare const getListOrdersQueryKey: (params?: ListOrdersParams) => readonly ["/api/orders", ...ListOrdersParams[]];
export declare const getListOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params?: ListOrdersParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>;
export type ListOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List orders
 */
export declare function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params?: ListOrdersParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Place an order
 */
export declare const getCreateOrderUrl: () => string;
export declare const createOrder: (createOrderBody: CreateOrderBody, options?: RequestInit) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<CreateOrderBody>;
export type CreateOrderMutationError = ErrorType<unknown>;
/**
 * @summary Place an order
 */
export declare const useCreateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
/**
 * @summary Get order by ID
 */
export declare const getGetOrderUrl: (id: string) => string;
export declare const getOrder: (id: string, options?: RequestInit) => Promise<Order>;
export declare const getGetOrderQueryKey: (id: string) => readonly [`/api/orders/${string}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<unknown>;
/**
 * @summary Get order by ID
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update order status
 */
export declare const getUpdateOrderStatusUrl: (id: string) => string;
export declare const updateOrderStatus: (id: string, updateOrderStatusBody: UpdateOrderStatusBody, options?: RequestInit) => Promise<Order>;
export declare const getUpdateOrderStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
        id: string;
        data: BodyType<UpdateOrderStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
    id: string;
    data: BodyType<UpdateOrderStatusBody>;
}, TContext>;
export type UpdateOrderStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateOrderStatus>>>;
export type UpdateOrderStatusMutationBody = BodyType<UpdateOrderStatusBody>;
export type UpdateOrderStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update order status
 */
export declare const useUpdateOrderStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
        id: string;
        data: BodyType<UpdateOrderStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
    id: string;
    data: BodyType<UpdateOrderStatusBody>;
}, TContext>;
/**
 * @summary Get user profile
 */
export declare const getGetUserUrl: (id: string) => string;
export declare const getUser: (id: string, options?: RequestInit) => Promise<User>;
export declare const getGetUserQueryKey: (id: string) => readonly [`/api/users/${string}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<unknown>;
/**
 * @summary Get user profile
 */
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get user wallet
 */
export declare const getGetUserWalletUrl: (id: string) => string;
export declare const getUserWallet: (id: string, options?: RequestInit) => Promise<Wallet>;
export declare const getGetUserWalletQueryKey: (id: string) => readonly [`/api/users/${string}/wallet`];
export declare const getGetUserWalletQueryOptions: <TData = Awaited<ReturnType<typeof getUserWallet>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserWallet>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUserWallet>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserWalletQueryResult = NonNullable<Awaited<ReturnType<typeof getUserWallet>>>;
export type GetUserWalletQueryError = ErrorType<unknown>;
/**
 * @summary Get user wallet
 */
export declare function useGetUserWallet<TData = Awaited<ReturnType<typeof getUserWallet>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserWallet>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List notifications
 */
export declare const getListNotificationsUrl: (params?: ListNotificationsParams) => string;
export declare const listNotifications: (params?: ListNotificationsParams, options?: RequestInit) => Promise<NotificationListResponse>;
export declare const getListNotificationsQueryKey: (params?: ListNotificationsParams) => readonly ["/api/notifications", ...ListNotificationsParams[]];
export declare const getListNotificationsQueryOptions: <TData = Awaited<ReturnType<typeof listNotifications>>, TError = ErrorType<unknown>>(params?: ListNotificationsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof listNotifications>>>;
export type ListNotificationsQueryError = ErrorType<unknown>;
/**
 * @summary List notifications
 */
export declare function useListNotifications<TData = Awaited<ReturnType<typeof listNotifications>>, TError = ErrorType<unknown>>(params?: ListNotificationsParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark notification as read
 */
export declare const getMarkNotificationReadUrl: (id: string) => string;
export declare const markNotificationRead: (id: string, options?: RequestInit) => Promise<Notification>;
export declare const getMarkNotificationReadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: string;
}, TContext>;
export type MarkNotificationReadMutationResult = NonNullable<Awaited<ReturnType<typeof markNotificationRead>>>;
export type MarkNotificationReadMutationError = ErrorType<unknown>;
/**
 * @summary Mark notification as read
 */
export declare const useMarkNotificationRead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Get admin dashboard stats
 */
export declare const getGetAdminDashboardUrl: () => string;
export declare const getAdminDashboard: (options?: RequestInit) => Promise<AdminDashboard>;
export declare const getGetAdminDashboardQueryKey: () => readonly ["/api/admin/dashboard"];
export declare const getGetAdminDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;
export type GetAdminDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get admin dashboard stats
 */
export declare function useGetAdminDashboard<TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get market stats for wallet graph
 */
export declare const getGetMarketStatsUrl: () => string;
export declare const getMarketStats: (options?: RequestInit) => Promise<MarketStats>;
export declare const getGetMarketStatsQueryKey: () => readonly ["/api/admin/market-stats"];
export declare const getGetMarketStatsQueryOptions: <TData = Awaited<ReturnType<typeof getMarketStats>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getMarketStats>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMarketStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMarketStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getMarketStats>>>;
export type GetMarketStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get market stats for wallet graph
 */
export declare function useGetMarketStats<TData = Awaited<ReturnType<typeof getMarketStats>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getMarketStats>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map