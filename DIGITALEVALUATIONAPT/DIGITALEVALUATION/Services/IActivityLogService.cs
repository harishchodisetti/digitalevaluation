using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IActivityLogService
    {
        Task CreateAsync(ActivityLogCreateDto dto);

        Task<List<ActivityLogDto>> GetAllAsync();

        Task<PagedResultAuditLog<ActivityLogDto>> GetPagedAsync(ActivityLogFilterDto filter);
    }
}
