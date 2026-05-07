using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using DIGITALEVALUATION.Contexts;
using System;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class RevaluationRequestService : IRevaluationRequestService
    {
        private readonly ApplicationDbContext _context;

        public RevaluationRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RevaluationRequestDto>> GetAllAsync()
        {
            return await _context.RevaluationRequests
                .Where(x => !x.IsDeleted)
                .Select(x => new RevaluationRequestDto
                {
                    RevaluationRequestId = x.RevaluationRequestId,
                    StudentId = x.StudentId,
                    ExamId = x.ExamId,
                    SubjectId = x.SubjectId,
                    OriginalMarks = x.OriginalMarks,
                    Reason = x.Reason,
                    RequestDate = x.RequestDate,
                    Status = x.Status,
                    Remarks = x.Remarks
                }).ToListAsync();
        }

        public async Task<RevaluationRequestDto?> GetByIdAsync(int id)
        {
            var x = await _context.RevaluationRequests.FindAsync(id);

            if (x == null || x.IsDeleted) return null;

            return new RevaluationRequestDto
            {
                RevaluationRequestId = x.RevaluationRequestId,
                StudentId = x.StudentId,
                ExamId = x.ExamId,
                SubjectId = x.SubjectId,
                OriginalMarks = x.OriginalMarks,
                Reason = x.Reason,
                RequestDate = x.RequestDate,
                Status = x.Status,
                Remarks = x.Remarks
            };
        }

        public async Task<RevaluationRequestDto> CreateAsync(CreateRevaluationRequestDto dto)
        {
            var entity = new RevaluationRequest
            {
                StudentId = dto.StudentId,
                ExamId = dto.ExamId,
                SubjectId = dto.SubjectId,
                OriginalMarks = dto.OriginalMarks,
                Reason = dto.Reason,
                Status = "Pending",
                CreatedDate = DateTime.Now
            };

            _context.RevaluationRequests.Add(entity);
            await _context.SaveChangesAsync();

            return new RevaluationRequestDto
            {
                RevaluationRequestId = entity.RevaluationRequestId,
                StudentId = entity.StudentId,
                ExamId = entity.ExamId,
                SubjectId = entity.SubjectId,
                OriginalMarks = entity.OriginalMarks,
                Reason = entity.Reason,
                RequestDate = entity.RequestDate,
                Status = entity.Status
            };
        }

        public async Task<bool> UpdateStatusAsync(UpdateRevaluationStatusDto dto)
        {
            var entity = await _context.RevaluationRequests.FindAsync(dto.RevaluationRequestId);

            if (entity == null || entity.IsDeleted) return false;

            entity.Status = dto.Status;
            entity.ApprovedBy = dto.ApprovedBy;
            entity.ApprovedDate = DateTime.Now;
            entity.Remarks = dto.Remarks;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.RevaluationRequests.FindAsync(id);

            if (entity == null) return false;

            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
