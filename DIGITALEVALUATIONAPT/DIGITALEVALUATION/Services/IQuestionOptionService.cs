using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IQuestionOptionService
    {
        Task<IEnumerable<QuestionOptionDto>> GetAllAsync(QuestionOptionQueryDto query);
        Task<QuestionOptionDto?> GetByIdAsync(int id);
        Task<QuestionOptionDto> CreateAsync(CreateQuestionOptionDto dto);
        Task<bool> UpdateAsync(UpdateQuestionOptionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
