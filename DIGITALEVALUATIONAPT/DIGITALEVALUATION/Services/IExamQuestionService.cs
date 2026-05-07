using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IExamQuestionService
    {
        Task<PagedResult<ExamQuestionDto>> GetAllAsync(ExamQuestionQueryDto query);
        Task<ExamQuestionDto?> GetByIdAsync(int id);
        Task<ExamQuestionDto> CreateAsync(CreateExamQuestionDto dto,string user);
        Task<bool> UpdateAsync(UpdateExamQuestionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
