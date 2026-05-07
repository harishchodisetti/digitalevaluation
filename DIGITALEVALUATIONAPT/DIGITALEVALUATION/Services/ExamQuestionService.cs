using DIGITALEVALUATION.Contexts;
using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace DIGITALEVALUATION.Services
{
    public class ExamQuestionService : IExamQuestionService
    {
        private readonly ApplicationDbContext _context;

        public ExamQuestionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ExamQuestionDto>> GetAllAsync(ExamQuestionQueryDto query)
        {
            var dbQuery = _context.ExamQuestions.AsQueryable();

            // 🔍 Filtering
            if (query.ExamId.HasValue)
                dbQuery = dbQuery.Where(x => x.ExamId == query.ExamId);

            if (!string.IsNullOrEmpty(query.Section))
                dbQuery = dbQuery.Where(x => x.Section == query.Section);

            var totalCount = await dbQuery.CountAsync();

            var data = await dbQuery
                .OrderBy(x => x.QuestionNumber)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new ExamQuestionDto
                {
                    ExamQuestionId = x.ExamQuestionId,
                    ExamId = x.ExamId,
                    QuestionId = x.QuestionId,
                    Section = x.Section,
                    QuestionNumber = x.QuestionNumber,
                    MaxMarks = x.MaxMarks,
                    IsCompulsory = x.IsCompulsory
                })
                .ToListAsync();

            return new PagedResult<ExamQuestionDto>
            {
                Items = data,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<ExamQuestionDto?> GetByIdAsync(int id)
        {
            var x = await _context.ExamQuestions.FindAsync(id);

            if (x == null) return null;

            return new ExamQuestionDto
            {
                ExamQuestionId = x.ExamQuestionId,
                ExamId = x.ExamId,
                QuestionId = x.QuestionId,
                Section = x.Section,
                QuestionNumber = x.QuestionNumber,
                MaxMarks = x.MaxMarks,
                IsCompulsory = x.IsCompulsory
            };
        }

        public async Task<ExamQuestionDto> CreateAsync(CreateExamQuestionDto dto, string user)
        {
            //  Prevent duplicate question in same exam
            bool exists = await _context.ExamQuestions
                .AnyAsync(x => x.ExamId == dto.ExamId && x.QuestionId == dto.QuestionId);

            if (exists)
                throw new Exception("Question already added to this exam");
    //        var maxNumber = await _context.ExamQuestions
    //.Where(x => x.ExamId == dto.ExamId)
    //.MaxAsync(x => (int?)x.QuestionNumber) ?? 0;

    //        entity.QuestionNumber = maxNumber + 1;
            var entity = new ExamQuestion
            {
                ExamId = dto.ExamId,
                QuestionId = dto.QuestionId,
                Section = dto.Section,
                QuestionNumber = dto.QuestionNumber,
                MaxMarks = dto.MaxMarks,
                IsCompulsory = dto.IsCompulsory,
                CreatedDate = DateTime.Now,
                CreatedBy=user
            };

            _context.ExamQuestions.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.ExamQuestionId) ?? new ExamQuestionDto();
        }

        public async Task<bool> UpdateAsync(UpdateExamQuestionDto dto)
        {
            var entity = await _context.ExamQuestions.FindAsync(dto.ExamQuestionId);

            if (entity == null) return false;

            entity.Section = dto.Section;
            entity.QuestionNumber = dto.QuestionNumber;
            entity.MaxMarks = dto.MaxMarks;
            entity.IsCompulsory = dto.IsCompulsory;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.ExamQuestions.FindAsync(id);

            if (entity == null) return false;
            _context.ExamQuestions.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
