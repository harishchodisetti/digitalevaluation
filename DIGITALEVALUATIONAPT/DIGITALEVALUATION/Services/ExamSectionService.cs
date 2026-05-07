namespace DIGITALEVALUATION.Services
{
    using DIGITALEVALUATION.DTOs;
    using DIGITALEVALUATION.Entities;
    using DIGITALEVALUATION.Contexts;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Security.Claims;

    public class ExamSectionService : IExamSectionService
    {
        private readonly ApplicationDbContext _context;

        public ExamSectionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ExamSectionDto>> GetAllAsync(ExamSectionQueryDto query)
        {
            var dbQuery = _context.ExamSections
                .Where(x => !x.IsDeleted);

            if (query.ExamId.HasValue)
                dbQuery = dbQuery.Where(x => x.ExamId == query.ExamId);

            var totalCount = await dbQuery.CountAsync();

            var data = await dbQuery
                .OrderBy(x => x.SectionId)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new ExamSectionDto
                {
                    SectionId = x.SectionId,
                    ExamId = x.ExamId,
                    SectionName = x.SectionName,
                    TotalQuestions = x.TotalQuestions,
                    AnswerRequired = x.AnswerRequired,
                    MarksPerQuestion = x.MarksPerQuestion,
                    CreatedBy = x.CreatedBy
                })
                .ToListAsync();

            return new PagedResult<ExamSectionDto>
            {
                Items = data,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<ExamSectionDto?> GetByIdAsync(int id)
        {
            var x = await _context.ExamSections
                .FirstOrDefaultAsync(x => x.SectionId == id && !x.IsDeleted);

            if (x == null) return null;

            return new ExamSectionDto
            {
                SectionId = x.SectionId,
                ExamId = x.ExamId,
                SectionName = x.SectionName,
                TotalQuestions = x.TotalQuestions,
                AnswerRequired = x.AnswerRequired,
                MarksPerQuestion = x.MarksPerQuestion,
                CreatedBy = x.CreatedBy
            };
        }

        public async Task<ExamSectionDto> CreateAsync(CreateExamSectionDto dto, ClaimsPrincipal user)
        {
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (dto.AnswerRequired > dto.TotalQuestions)
                throw new Exception("Invalid question count");

            var entity = new ExamSection
            {
                ExamId = dto.ExamId,
                SectionName = dto.SectionName,
                TotalQuestions = dto.TotalQuestions,
                AnswerRequired = dto.AnswerRequired,
                MarksPerQuestion = dto.MarksPerQuestion,
                CreatedBy = userId,
                CreatedDate = DateTime.Now
            };

            _context.ExamSections.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.SectionId) ?? new ExamSectionDto();
        }

        public async Task<bool> UpdateAsync(UpdateExamSectionDto dto, ClaimsPrincipal user)
        {
            var entity = await _context.ExamSections.FindAsync(dto.SectionId);

            if (entity == null || entity.IsDeleted) return false;

            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            entity.SectionName = dto.SectionName;
            entity.TotalQuestions = dto.TotalQuestions;
            entity.AnswerRequired = dto.AnswerRequired;
            entity.MarksPerQuestion = dto.MarksPerQuestion;

            entity.UpdatedBy = userId;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, ClaimsPrincipal user)
        {
            var entity = await _context.ExamSections.FindAsync(id);

            if (entity == null) return false;

            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            entity.IsDeleted = true;
            entity.UpdatedBy = userId;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
