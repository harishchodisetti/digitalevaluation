using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using DIGITALEVALUATION.Contexts;
using System;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class RevaluationDetailService : IRevaluationDetailService
    {
        private readonly ApplicationDbContext _context;

        public RevaluationDetailService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<RevaluationDetailDto>> GetAllAsync(RevaluationDetailQueryDto query, ClaimsPrincipal user)
        {
            var dbQuery = _context.RevaluationDetails
                .Where(x => !x.IsDeleted)
                .AsQueryable();

            // 🔐 Role-based filtering
            var role = user.FindFirst(ClaimTypes.Role)?.Value;
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (role == "Faculty")
            {
                int facultyId = int.Parse(userId!);
                dbQuery = dbQuery.Where(x => x.FacultyId == facultyId);
            }

            // 🔍 Filtering
            if (query.FacultyId.HasValue)
                dbQuery = dbQuery.Where(x => x.FacultyId == query.FacultyId);

            if (query.RevaluationRequestId.HasValue)
                dbQuery = dbQuery.Where(x => x.RevaluationRequestId == query.RevaluationRequestId);

            // 📊 Count
            var totalCount = await dbQuery.CountAsync();

            // 📄 Pagination
            var data = await dbQuery
                .OrderByDescending(x => x.RevaluationDetailId)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new RevaluationDetailDto
                {
                    RevaluationDetailId = x.RevaluationDetailId,
                    RevaluationRequestId = x.RevaluationRequestId,
                    FacultyId = x.FacultyId,
                    OldMarks = x.OldMarks,
                    NewMarks = x.NewMarks,
                    DifferenceMarks = x.DifferenceMarks,
                    EvaluatedDate = x.EvaluatedDate,
                    Remarks = x.Remarks
                })
                .ToListAsync();

            return new PagedResult<RevaluationDetailDto>
            {
                Items = data,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<RevaluationDetailDto?> GetByIdAsync(int id)
        {
            var x = await _context.RevaluationDetails.FindAsync(id);

            if (x == null || x.IsDeleted) return null;

            return new RevaluationDetailDto
            {
                RevaluationDetailId = x.RevaluationDetailId,
                RevaluationRequestId = x.RevaluationRequestId,
                FacultyId = x.FacultyId,
                OldMarks = x.OldMarks,
                NewMarks = x.NewMarks,
                DifferenceMarks = x.DifferenceMarks,
                EvaluatedDate = x.EvaluatedDate,
                Remarks = x.Remarks
            };
        }

        public async Task<RevaluationDetailDto> CreateAsync(CreateRevaluationDetailDto dto)
        {
            var entity = new RevaluationDetail
            {
                RevaluationRequestId = dto.RevaluationRequestId,
                FacultyId = dto.FacultyId,
                OldMarks = dto.OldMarks,
                NewMarks = dto.NewMarks,
                Remarks = dto.Remarks,
                EvaluatedDate = DateTime.Now,
                CreatedDate = DateTime.Now
            };

            _context.RevaluationDetails.Add(entity);
            await _context.SaveChangesAsync();

            return new RevaluationDetailDto
            {
                RevaluationDetailId = entity.RevaluationDetailId,
                RevaluationRequestId = entity.RevaluationRequestId,
                FacultyId = entity.FacultyId,
                OldMarks = entity.OldMarks,
                NewMarks = entity.NewMarks,
                DifferenceMarks = entity.DifferenceMarks,
                EvaluatedDate = entity.EvaluatedDate,
                Remarks = entity.Remarks
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.RevaluationDetails.FindAsync(id);

            if (entity == null) return false;

            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
