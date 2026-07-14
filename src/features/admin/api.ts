import { apiClient, apiGet } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type {
  AdminCatalogRow,
  AdminOrderStatus,
  AdminOverview,
  AdminStaffMember,
  CreateProductInput,
  CreateStaffInput,
  PaginatedAdminCatalog,
  PaginatedAdminOrders,
  PaginatedAdminStaff,
} from './schema';

export function fetchOverview(): Promise<AdminOverview> {
  return apiGet<AdminOverview>(endpoints.admin.overview);
}

export function fetchAdminStaff(): Promise<PaginatedAdminStaff> {
  return apiGet<PaginatedAdminStaff>(`${endpoints.admin.staff}?limit=50`);
}

export async function createStaff(input: CreateStaffInput): Promise<AdminStaffMember> {
  const { data } = await apiClient.post<AdminStaffMember>(endpoints.admin.staff, input);
  return data;
}

export function fetchAdminCatalog(): Promise<PaginatedAdminCatalog> {
  return apiGet<PaginatedAdminCatalog>(`${endpoints.admin.catalog}?limit=100`);
}

export async function createProduct(input: CreateProductInput): Promise<AdminCatalogRow> {
  const { data } = await apiClient.post<AdminCatalogRow>(endpoints.admin.products, input);
  return data;
}

export function fetchAdminOrders(status?: AdminOrderStatus): Promise<PaginatedAdminOrders> {
  const qs = status ? `?status=${status}&limit=50` : '?limit=50';
  return apiGet<PaginatedAdminOrders>(`${endpoints.admin.orders}${qs}`);
}
