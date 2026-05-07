namespace DIGITALEVALUATION.Services
{
    using DIGITALEVALUATION.Contexts;
    using DIGITALEVALUATION.DTOs;
    using DIGITALEVALUATION.Entities;
    using Microsoft.EntityFrameworkCore;

    public class ActivityLogService : IActivityLogService
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(ActivityLogCreateDto dto)
        {
            var log = new ActivityLog
            {
                UserId = dto.UserId,
                UserName = dto.UserName,
                ActivityType = dto.ActivityType,
                Module = dto.Module,
                Description = dto.Description,
                IPAddress = dto.IPAddress,
                UserAgent = dto.UserAgent,
                Path = dto.Path,
                Method = dto.Method,
                StatusCode = dto.StatusCode,
                CreatedDate = DateTime.Now
            };

            await _context.ActivityLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ActivityLogDto>> GetAllAsync()
        {
            return await _context.ActivityLogs
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new ActivityLogDto
                {
                    ActivityLogId = x.ActivityLogId,
                    UserName = x.UserName,
                    ActivityType = x.ActivityType,
                    Module = x.Module,
                    Description = x.Description,
                    Path = x.Path,
                    Method = x.Method,
                    StatusCode = x.StatusCode,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();
        }

        public async Task<PagedResultAuditLog<ActivityLogDto>> GetPagedAsync(ActivityLogFilterDto filter)
        {
            var query = _context.ActivityLogs.AsQueryable();

            if (!string.IsNullOrEmpty(filter.UserName))
                query = query.Where(x => x.UserName.Contains(filter.UserName));

            if (!string.IsNullOrEmpty(filter.ActivityType))
                query = query.Where(x => x.ActivityType == filter.ActivityType);

            if (!string.IsNullOrEmpty(filter.Module))
                query = query.Where(x => x.Module == filter.Module);

            if (filter.FromDate.HasValue)
                query = query.Where(x => x.CreatedDate >= filter.FromDate);

            if (filter.ToDate.HasValue)
                query = query.Where(x => x.CreatedDate <= filter.ToDate);

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => new ActivityLogDto
                {
                    ActivityLogId = x.ActivityLogId,
                    UserName = x.UserName,
                    ActivityType = x.ActivityType,
                    Module = x.Module,
                    Description = x.Description,
                    Path = x.Path,
                    Method = x.Method,
                    StatusCode = x.StatusCode,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();

            return new PagedResultAuditLog<ActivityLogDto>
            {
                Data = data,
                TotalRecords = totalRecords,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }
    }
}
