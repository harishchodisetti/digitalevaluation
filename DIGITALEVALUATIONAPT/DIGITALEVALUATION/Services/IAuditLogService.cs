using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IAuditLogService
    {
        Task CreateAsync(AuditLogCreateDto dto);

        Task<List<AuditLogDto>> GetAllAsync();

        Task<PagedResultAuditLog<AuditLogDto>> GetPagedAsync(AuditLogFilterDto filter);
    }
}
