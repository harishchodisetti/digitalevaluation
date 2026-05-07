using DIGITALEVALUATION.DTOs;
using System.Security.Claims;

namespace DIGITALEVALUATION.Services
{
    public interface IRevaluationAssignmentService
    {
        Task<PagedResult<RevaluationAssignmentDto>> GetAllAsync(RevaluationAssignmentQueryDto query, ClaimsPrincipal user);
        Task<RevaluationAssignmentDto?> GetByIdAsync(int id);
        Task<RevaluationAssignmentDto> CreateAsync(CreateRevaluationAssignmentDto dto);
        Task<bool> UpdateStatusAsync(UpdateAssignmentStatusDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
