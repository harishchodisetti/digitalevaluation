using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using DIGITALEVALUATION.Contexts;
using System;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class RevaluationAssignmentService : IRevaluationAssignmentService
    {
        private readonly ApplicationDbContext _context;

        public RevaluationAssignmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<RevaluationAssignmentDto>> GetAllAsync(RevaluationAssignmentQueryDto query, ClaimsPrincipal user)
        {
            var dbQuery = _context.RevaluationAssignments
                .Where(x => !x.IsDeleted)
                .AsQueryable();

            //  Role-based filtering
            var role = user.FindFirst(ClaimTypes.Role)?.Value;
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (role == "Faculty")
            {
                int facultyId = int.Parse(userId!);
                dbQuery = dbQuery.Where(x => x.FacultyId == facultyId);
            }

            //  Filtering
            if (query.FacultyId.HasValue)
                dbQuery = dbQuery.Where(x => x.FacultyId == query.FacultyId);

            if (query.RevaluationRequestId.HasValue)
                dbQuery = dbQuery.Where(x => x.RevaluationRequestId == query.RevaluationRequestId);

            if (!string.IsNullOrEmpty(query.Status))
                dbQuery = dbQuery.Where(x => x.Status == query.Status);

            //  Count
            var totalCount = await dbQuery.CountAsync();

            //  Pagination
            var data = await dbQuery
                .OrderByDescending(x => x.RevaluationAssignmentId)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new RevaluationAssignmentDto
                {
                    RevaluationAssignmentId = x.RevaluationAssignmentId,
                    RevaluationRequestId = x.RevaluationRequestId,
                    FacultyId = x.FacultyId,
                    AssignedDate = x.AssignedDate,
                    Status = x.Status
                })
                .ToListAsync();

            return new PagedResult<RevaluationAssignmentDto>
            {
                Items = data,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<RevaluationAssignmentDto?> GetByIdAsync(int id)
        {
            var x = await _context.RevaluationAssignments.FindAsync(id);

            if (x == null || x.IsDeleted) return null;

            return new RevaluationAssignmentDto
            {
                RevaluationAssignmentId = x.RevaluationAssignmentId,
                RevaluationRequestId = x.RevaluationRequestId,
                FacultyId = x.FacultyId,
                AssignedDate = x.AssignedDate,
                Status = x.Status
            };
        }

        public async Task<RevaluationAssignmentDto> CreateAsync(CreateRevaluationAssignmentDto dto)
        {
            var entity = new RevaluationAssignment
            {
                RevaluationRequestId = dto.RevaluationRequestId,
                FacultyId = dto.FacultyId,
                Status = "Assigned",
                CreatedDate = DateTime.Now
            };

            _context.RevaluationAssignments.Add(entity);
            await _context.SaveChangesAsync();

            return new RevaluationAssignmentDto
            {
                RevaluationAssignmentId = entity.RevaluationAssignmentId,
                RevaluationRequestId = entity.RevaluationRequestId,
                FacultyId = entity.FacultyId,
                AssignedDate = entity.AssignedDate,
                Status = entity.Status
            };
        }

        public async Task<bool> UpdateStatusAsync(UpdateAssignmentStatusDto dto)
        {
            var entity = await _context.RevaluationAssignments.FindAsync(dto.RevaluationAssignmentId);

            if (entity == null || entity.IsDeleted) return false;

            entity.Status = dto.Status;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.RevaluationAssignments.FindAsync(id);

            if (entity == null) return false;

            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
