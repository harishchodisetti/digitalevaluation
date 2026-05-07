using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using DIGITALEVALUATION.Contexts;
using System;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class RevaluationMarkService : IRevaluationMarkService
    {
        private readonly ApplicationDbContext _context;

        public RevaluationMarkService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RevaluationMarkDto> CreateAsync(CreateRevaluationMarkDto dto, string userId)
        {
            var entity = new RevaluationMark
            {
                RevaluationDetailId = dto.RevaluationDetailId,
                QuestionId = dto.QuestionId,
                OldMarks = dto.OldMarks,
                NewMarks = dto.NewMarks,
                CreatedBy = userId,
                CreatedDate = DateTime.Now
            };

            _context.RevaluationMarks.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<RevaluationMarkDto> UpdateAsync(UpdateRevaluationMarkDto dto, string userId)
        {
            var entity = await _context.RevaluationMarks.FindAsync(dto.Id);
            if (entity == null) throw new Exception("Not found");

            entity.OldMarks = dto.OldMarks;
            entity.NewMarks = dto.NewMarks;
            entity.UpdatedBy = userId;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.RevaluationMarks.FindAsync(id);
            if (entity == null) return false;

            _context.RevaluationMarks.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<RevaluationMarkDto?> GetByIdAsync(int id)
        {
            return await _context.RevaluationMarks
                .Include(x => x.Question)
                .Where(x => x.Id == id)
                .Select(x => new RevaluationMarkDto
                {
                    Id = x.Id,
                    RevaluationDetailId = x.RevaluationDetailId,
                    QuestionId = x.QuestionId,
                    QuestionText = x.Question.QuestionText,
                    OldMarks = x.OldMarks,
                    NewMarks = x.NewMarks,
                    CreatedDate = x.CreatedDate
                })
                .FirstOrDefaultAsync();
        }

        public async Task<(IEnumerable<RevaluationMarkDto>, int)> GetAllAsync(RevaluationMarkFilterDto filter)
        {
            var query = _context.RevaluationMarks
                .Include(x => x.Question)
                .AsQueryable();

            if (filter.RevaluationDetailId.HasValue)
                query = query.Where(x => x.RevaluationDetailId == filter.RevaluationDetailId);

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.Id)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => new RevaluationMarkDto
                {
                    Id = x.Id,
                    RevaluationDetailId = x.RevaluationDetailId,
                    QuestionId = x.QuestionId,
                    QuestionText = x.Question.QuestionText,
                    OldMarks = x.OldMarks,
                    NewMarks = x.NewMarks,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();

            return (data, total);
        }
    }
}
