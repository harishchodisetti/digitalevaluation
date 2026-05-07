using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IRevaluationRequestService
    {
        Task<IEnumerable<RevaluationRequestDto>> GetAllAsync();
        Task<RevaluationRequestDto?> GetByIdAsync(int id);
        Task<RevaluationRequestDto> CreateAsync(CreateRevaluationRequestDto dto);
        Task<bool> UpdateStatusAsync(UpdateRevaluationStatusDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
