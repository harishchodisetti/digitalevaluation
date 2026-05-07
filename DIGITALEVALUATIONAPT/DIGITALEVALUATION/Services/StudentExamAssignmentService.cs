using DIGITALEVALUATION.Contexts;
using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class StudentExamAssignmentService : IStudentExamAssignmentService
    {
        private readonly ApplicationDbContext _context;

        public StudentExamAssignmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<StudentExamAssignmentDto> CreateAsync(StudentExamAssignmentCreateDto dto)
        {
            //  Basic Validation
            if (dto.StudentId <= 0)
                throw new Exception("Invalid StudentId");

            if (dto.ExamId <= 0)
                throw new Exception("Invalid ExamId");

            //  Prevent Duplicate Assignment (same attempt)
            var exists = await _context.StudentExamAssignments.AnyAsync(x =>
                x.StudentId == dto.StudentId &&
                x.ExamId == dto.ExamId &&
                x.AttemptNumber == dto.AttemptNumber);

            if (exists)
                throw new Exception("Exam already assigned for this attempt");

            //  Validate Time Logic
            if (dto.StartTime.HasValue && dto.EndTime.HasValue &&
                dto.StartTime > dto.EndTime)
            {
                throw new Exception("StartTime cannot be greater than EndTime");
            }

            //  Safe Defaults (override risky fields)
            var entity = new StudentExamAssignment
            {
                StudentId = dto.StudentId,
                ExamId = dto.ExamId,

                ExamDate = dto.ExamDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,

                // Always control status from backend
                Status = string.IsNullOrEmpty(dto.Status) ? "Assigned" : dto.Status,

                AttemptNumber = dto.AttemptNumber,

                IsRevaluationRequested = false, // force false on create

                //IsActive = dto.IsActive,

                CreatedBy = dto.CreatedBy,
                CreatedDate = DateTime.Now,

                AssignedDate = dto.AssignedDate ?? DateTime.Now
            };

            _context.StudentExamAssignments.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDto(entity);
        }
        private static StudentExamAssignmentDto MapToDto(StudentExamAssignment entity)
        {
            return new StudentExamAssignmentDto
            {
                StudentExamAssignmentId = entity.StudentExamAssignmentId,
                StudentId = entity.StudentId,
                ExamId = entity.ExamId,

               // AssignedDate = entity.AssignedDate,
                ExamDate = entity.ExamDate,

                //StartTime = entity.StartTime,
               // EndTime = entity.EndTime,

                Status = entity.Status,
                //AttemptNumber = entity.AttemptNumber,

               // IsRevaluationRequested = entity.IsRevaluationRequested,

                //CreatedBy = entity.CreatedBy,
               // CreatedDate = entity.CreatedDate,

                //UpdatedBy = entity.UpdatedBy,
                //UpdatedDate = entity.UpdatedDate
            };
        }
        public async Task<StudentExamAssignmentDto> UpdateAsync(StudentExamAssignmentUpdateDto dto)
        {
            var entity = await _context.StudentExamAssignments.FindAsync(dto.StudentExamAssignmentId);

            if (entity == null) throw new Exception("Record not found");

            entity.Status = dto.Status;
            entity.StartTime = dto.StartTime;
            entity.EndTime = dto.EndTime;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return new StudentExamAssignmentDto
            {
                StudentExamAssignmentId = entity.StudentExamAssignmentId,
                StudentId = entity.StudentId,
                ExamId = entity.ExamId,
                Status = entity.Status,
                ExamDate = entity.ExamDate
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.StudentExamAssignments.FindAsync(id);
            if (entity == null) return false;

            _context.StudentExamAssignments.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<StudentExamAssignmentDto?> GetByIdAsync(int id)
        {
            var entity = await _context.StudentExamAssignments.FindAsync(id);

            if (entity == null) return null;

            return new StudentExamAssignmentDto
            {
                StudentExamAssignmentId = entity.StudentExamAssignmentId,
                StudentId = entity.StudentId,
                ExamId = entity.ExamId,
                Status = entity.Status,
                ExamDate = entity.ExamDate
            };
        }

        public async Task<IEnumerable<StudentExamAssignmentDto>> GetAllAsync(int page, int pageSize, string? status)
        {
            var query = _context.StudentExamAssignments.AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(x => x.Status == status);

            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new StudentExamAssignmentDto
                {
                    StudentExamAssignmentId = x.StudentExamAssignmentId,
                    StudentId = x.StudentId,
                    ExamId = x.ExamId,
                    Status = x.Status,
                    ExamDate = x.ExamDate
                })
                .ToListAsync();
        }
    }
}
