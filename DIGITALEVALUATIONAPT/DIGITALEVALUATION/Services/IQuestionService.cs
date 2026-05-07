using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IQuestionService
    {
        Task<PagedResult<QuestionDto>> GetAllAsync(QuestionQueryDto query);
        Task<QuestionDto?> GetByIdAsync(int id);
        Task<QuestionDto> CreateAsync(CreateQuestionDto dto);
        Task<bool> UpdateAsync(UpdateQuestionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
