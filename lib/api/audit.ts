import { apiClient, ApiResponse } from './client';
import { PageResponse } from './students';

export interface AuditLogDto {
  id: string;
  institutionId: string;
  actorId: string;
  actorIdentifier?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details?: string;
  createdAt: string;
}

export const auditApi = {
  getAuditLogs: async (
    page = 0,
    size = 20,
    filters?: { actorId?: string; action?: string; resourceType?: string }
  ): Promise<ApiResponse<PageResponse<AuditLogDto>>> => {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (filters?.actorId) query.append('actorId', filters.actorId);
    if (filters?.action) query.append('action', filters.action);
    if (filters?.resourceType) query.append('resourceType', filters.resourceType);

    return apiClient<PageResponse<AuditLogDto>>(`/api/v1/audit-logs?${query.toString()}`);
  },
};
