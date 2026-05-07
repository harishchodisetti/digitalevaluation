using DIGITALEVALUATION.Contexts;
using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace DIGITALEVALUATION.Services
{
    public class QuestionOptionService : IQuestionOptionService
    {
        private readonly ApplicationDbContext _context;

        public QuestionOptionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<QuestionOptionDto>> GetAllAsync(QuestionOptionQueryDto query)
        {
            var dbQuery = _context.QuestionOptions.AsQueryable();

            // 🔍 Filter by QuestionId
            if (query.QuestionId.HasValue)
                dbQuery = dbQuery.Where(x => x.QuestionId == query.QuestionId);

            return await dbQuery
                .Select(x => new QuestionOptionDto
                {
                    OptionId = x.OptionId,
                    QuestionId = x.QuestionId,
                    OptionText = x.OptionText,
                    IsCorrect = x.IsCorrect
                })
                .ToListAsync();
        }

        public async Task<QuestionOptionDto?> GetByIdAsync(int id)
        {
            var x = await _context.QuestionOptions.FindAsync(id);

            if (x == null) return null;

            return new QuestionOptionDto
            {
                OptionId = x.OptionId,
                QuestionId = x.QuestionId,
                OptionText = x.OptionText,
                IsCorrect = x.IsCorrect
            };
        }

        public async Task<QuestionOptionDto> CreateAsync(CreateQuestionOptionDto dto)
        {
            //  Validation: Only one correct option (for MCQ)
            if (dto.IsCorrect)
            {
                bool exists = await _context.QuestionOptions
                    .AnyAsync(x => x.QuestionId == dto.QuestionId && x.IsCorrect);

                if (exists)
                    throw new Exception("Correct option already exists for this question");
            }
            var count = await _context.QuestionOptions
    .CountAsync(x => x.QuestionId == dto.QuestionId);

            //if (count < 3)
            //    throw new Exception("Minimum 4 options required");

            var entity = new QuestionOption
            {
                QuestionId = dto.QuestionId,
                OptionText = dto.OptionText,
                IsCorrect = dto.IsCorrect,
                CreatedDate = DateTime.Now
            };

            _context.QuestionOptions.Add(entity);
            await _context.SaveChangesAsync();

            return new QuestionOptionDto
            {
                OptionId = entity.OptionId,
                QuestionId = entity.QuestionId,
                OptionText = entity.OptionText,
                IsCorrect = entity.IsCorrect
            };
        }

        public async Task<bool> UpdateAsync(UpdateQuestionOptionDto dto)
        {
            var entity = await _context.QuestionOptions.FindAsync(dto.OptionId);

            if (entity == null) return false;

            // 🔥 Validation
            if (dto.IsCorrect)
            {
                bool exists = await _context.QuestionOptions
                    .AnyAsync(x => x.QuestionId == dto.QuestionId && x.IsCorrect && x.OptionId != dto.OptionId);

                if (exists)
                    throw new Exception("Correct option already exists");
            }

            entity.OptionText = dto.OptionText;
            entity.IsCorrect = dto.IsCorrect;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.QuestionOptions.FindAsync(id);

            if (entity == null) return false;

            _context.QuestionOptions.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
