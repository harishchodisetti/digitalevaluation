using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IRevaluationMarkService
    {
        Task<RevaluationMarkDto> CreateAsync(CreateRevaluationMarkDto dto, string userId);
        Task<RevaluationMarkDto> UpdateAsync(UpdateRevaluationMarkDto dto, string userId);
        Task<bool> DeleteAsync(int id);

        Task<RevaluationMarkDto?> GetByIdAsync(int id);
        Task<(IEnumerable<RevaluationMarkDto>, int)> GetAllAsync(RevaluationMarkFilterDto filter);
    }
}
