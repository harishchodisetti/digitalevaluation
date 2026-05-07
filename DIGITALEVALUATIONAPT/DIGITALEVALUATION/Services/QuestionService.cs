using DIGITALEVALUATION.Contexts;
using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace DIGITALEVALUATION.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly ApplicationDbContext _context;

        public QuestionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<QuestionDto>> GetAllAsync(QuestionQueryDto query)
        {
            var dbQuery = _context.Questions
                .Where(x => !x.IsDeleted)
                .AsQueryable();

            // 🔍 Filtering
            if (query.SubjectId.HasValue)
                dbQuery = dbQuery.Where(x => x.SubjectId == query.SubjectId);

            if (query.BranchId.HasValue)
                dbQuery = dbQuery.Where(x => x.BranchId == query.BranchId);

            if (query.CourseId.HasValue)
                dbQuery = dbQuery.Where(x => x.CourseId == query.CourseId);

            if (query.CollegeId.HasValue)
                dbQuery = dbQuery.Where(x => x.CollegeId == query.CollegeId);

            if (!string.IsNullOrEmpty(query.QuestionType))
                dbQuery = dbQuery.Where(x => x.QuestionType == query.QuestionType);

            if (!string.IsNullOrEmpty(query.DifficultyLevel))
                dbQuery = dbQuery.Where(x => x.DifficultyLevel == query.DifficultyLevel);

            if (query.Semester.HasValue)
                dbQuery = dbQuery.Where(x => x.Semester == query.Semester);

            if (query.UnitNumber.HasValue)
                dbQuery = dbQuery.Where(x => x.UnitNumber == query.UnitNumber);

            // 🔎 Search (Text + Tags)
            if (!string.IsNullOrEmpty(query.Search))
            {
                dbQuery = dbQuery.Where(x =>
                    x.QuestionText!.Contains(query.Search) ||
                    x.Tags!.Contains(query.Search));
            }

            var totalCount = await dbQuery.CountAsync();

            var data = await dbQuery
                .OrderByDescending(x => x.QuestionId)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new QuestionDto
                {
                    QuestionId = x.QuestionId,
                    QuestionCode = x.QuestionCode,
                    QuestionText = x.QuestionText,
                    QuestionType = x.QuestionType,
                    DifficultyLevel = x.DifficultyLevel,
                    SubjectId = x.SubjectId,
                    MaxMarks = x.MaxMarks,
                    IsOptional = x.IsOptional,
                    Tags = x.Tags
                })
                .ToListAsync();

            return new PagedResult<QuestionDto>
            {
                Items = data,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<QuestionDto?> GetByIdAsync(int id)
        {
            var x = await _context.Questions.FindAsync(id);

            if (x == null || x.IsDeleted) return null;

            return new QuestionDto
            {
                QuestionId = x.QuestionId,
                QuestionCode = x.QuestionCode,
                QuestionText = x.QuestionText,
                QuestionType = x.QuestionType,
                DifficultyLevel = x.DifficultyLevel,
                SubjectId = x.SubjectId,
                MaxMarks = x.MaxMarks,
                IsOptional = x.IsOptional,
                Tags = x.Tags
            };
        }

        public async Task<QuestionDto> CreateAsync(CreateQuestionDto dto)
        {
            bool exists = await _context.Questions
     .AnyAsync(x => x.QuestionText == dto.QuestionText && !x.IsDeleted);
            if (exists)
            {
                return null;
            }
            var entity = new Question
            {
                QuestionCode = dto.QuestionCode,
                QuestionText = dto.QuestionText,
                QuestionImagePath = dto.QuestionImagePath,
                QuestionType = dto.QuestionType,
                DifficultyLevel = dto.DifficultyLevel,
                CollegeId = dto.CollegeId,
                CourseId = dto.CourseId,
                BranchId = dto.BranchId,
                SubjectId = dto.SubjectId,
                Semester = dto.Semester,
                UnitNumber = dto.UnitNumber,
                MaxMarks = dto.MaxMarks,
                IsOptional = dto.IsOptional,
                Tags = dto.Tags,
                CreatedDate = DateTime.Now
            };

            _context.Questions.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.QuestionId) ?? new QuestionDto();
        }

        public async Task<bool> UpdateAsync(UpdateQuestionDto dto)
        {
            var entity = await _context.Questions.FindAsync(dto.QuestionId);

            if (entity == null || entity.IsDeleted) return false;

            entity.QuestionCode = dto.QuestionCode;
            entity.QuestionText = dto.QuestionText;
            entity.QuestionImagePath = dto.QuestionImagePath;
            entity.QuestionType = dto.QuestionType;
            entity.DifficultyLevel = dto.DifficultyLevel;
            entity.SubjectId = dto.SubjectId;
            entity.MaxMarks = dto.MaxMarks;
            entity.Tags = dto.Tags;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Questions.FindAsync(id);

            if (entity == null) return false;

            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
