namespace DIGITALEVALUATION.Services
{
    using DIGITALEVALUATION.Contexts;
    using DIGITALEVALUATION.DTOs;
    using DIGITALEVALUATION.Entities;
    using Microsoft.EntityFrameworkCore;

    public class AuditLogService : IAuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(AuditLogCreateDto dto)
        {
            var log = new AuditLog
            {
                UserId = dto.UserId,
                UserName = dto.UserName,
                Action = dto.Action,
                EntityName = dto.EntityName,
                RecordId = dto.RecordId,
                OldValues = dto.OldValues,
                NewValues = dto.NewValues,
                IPAddress = dto.IPAddress,
                UserAgent = dto.UserAgent,
                Module = dto.Module,
                CreatedDate = DateTime.Now
            };

            await _context.AuditLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        public async Task<List<AuditLogDto>> GetAllAsync()
        {
            return await _context.AuditLogs
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new AuditLogDto
                {
                    AuditLogId = x.AuditLogId,
                    UserName = x.UserName,
                    Action = x.Action,
                    EntityName = x.EntityName,
                    RecordId = x.RecordId,
                    Module = x.Module,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();
        }

        public async Task<PagedResultAuditLog<AuditLogDto>> GetPagedAsync(AuditLogFilterDto filter)
        {
            var query = _context.AuditLogs.AsQueryable();

            if (!string.IsNullOrEmpty(filter.UserName))
                query = query.Where(x => x.UserName.Contains(filter.UserName));

            if (!string.IsNullOrEmpty(filter.Action))
                query = query.Where(x => x.Action == filter.Action);

            if (!string.IsNullOrEmpty(filter.EntityName))
                query = query.Where(x => x.EntityName == filter.EntityName);

            if (filter.FromDate.HasValue)
                query = query.Where(x => x.CreatedDate >= filter.FromDate);

            if (filter.ToDate.HasValue)
                query = query.Where(x => x.CreatedDate <= filter.ToDate);

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedDate)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => new AuditLogDto
                {
                    AuditLogId = x.AuditLogId,
                    UserName = x.UserName,
                    Action = x.Action,
                    EntityName = x.EntityName,
                    RecordId = x.RecordId,
                    Module = x.Module,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();

            return new PagedResultAuditLog<AuditLogDto>
            {
                Data = data,
                TotalRecords = totalRecords,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }
    }
}
