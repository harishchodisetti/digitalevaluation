using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Entities;
using DIGITALEVALUATION.Helpers;
using DIGITALEVALUATION.Contexts;
using System;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class StudentAnswerService : IStudentAnswerService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public StudentAnswerService(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<StudentAnswerDto> CreateAsync(CreateStudentAnswerDto dto, string userId)
        {
            string? filePath = null;

            if (dto.File != null)
                filePath = await FileHelper.SaveFileAsync(dto.File, _env.WebRootPath);

            var entity = new StudentAnswer
            {
                AnswerSheetId = dto.AnswerSheetId,
                QuestionId = dto.QuestionId,
                AnswerText = dto.AnswerText,
                FilePath = filePath,
                CreatedBy = userId,
                CreatedDate = DateTime.Now
            };

            _context.StudentAnswers.Add(entity);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.StudentAnswerId);
        }

        public async Task<StudentAnswerDto> UpdateAsync(UpdateStudentAnswerDto dto, string userId)
        {
            var entity = await _context.StudentAnswers.FindAsync(dto.StudentAnswerId);
            if (entity == null) throw new Exception("Not found");

            if (dto.File != null)
                entity.FilePath = await FileHelper.SaveFileAsync(dto.File, _env.WebRootPath);

            entity.AnswerText = dto.AnswerText;
            entity.UpdatedBy = userId;
            entity.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.StudentAnswerId);
        }

        public async Task<StudentAnswerDto> EvaluateAsync(EvaluateStudentAnswerDto dto, string userId)
        {
            var entity = await _context.StudentAnswers.FindAsync(dto.StudentAnswerId);
            if (entity == null) throw new Exception("Not found");

            entity.MarksAwarded = dto.MarksAwarded;
            entity.EvaluatorRemarks = dto.EvaluatorRemarks;
            entity.EvaluatedBy = int.Parse(userId);
            entity.EvaluatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(entity.StudentAnswerId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.StudentAnswers.FindAsync(id);
            if (entity == null) return false;

            _context.StudentAnswers.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<StudentAnswerDto?> GetByIdAsync(int id)
        {
            return await _context.StudentAnswers
                .Include(x => x.Question)
                   .Where(x => x.StudentAnswerId == id)
                .Select(x => new StudentAnswerDto
                {
                    StudentAnswerId = x.StudentAnswerId,
                    AnswerSheetId = x.AnswerSheetId,
                    QuestionId = x.QuestionId,
                    QuestionText = x.Question.QuestionText,
                    AnswerText = x.AnswerText,
                    FilePath = x.FilePath,
                    MarksAwarded = x.MarksAwarded,
                    EvaluatorRemarks = x.EvaluatorRemarks,
                    CreatedDate = x.CreatedDate
                })
                .FirstOrDefaultAsync();
        }

        public async Task<(IEnumerable<StudentAnswerDto>, int)> GetAllAsync(StudentAnswerFilterDto filter)
        {
            var query = _context.StudentAnswers
                .Include(x => x.Question)
                 .AsQueryable();

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.StudentAnswerId)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => new StudentAnswerDto
                {
                    StudentAnswerId = x.StudentAnswerId,
                    AnswerSheetId = x.AnswerSheetId,
                    QuestionId = x.QuestionId,
                    QuestionText = x.Question.QuestionText,
                    AnswerText = x.AnswerText,
                    FilePath = x.FilePath,
                    MarksAwarded = x.MarksAwarded,
                    EvaluatorRemarks = x.EvaluatorRemarks,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();

            return (data, total);
        }
    }
}
