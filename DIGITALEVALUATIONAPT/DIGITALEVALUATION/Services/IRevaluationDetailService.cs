using DIGITALEVALUATION.DTOs;
using System.Security.Claims;

namespace DIGITALEVALUATION.Services
{
    public interface IRevaluationDetailService
    {
        Task<PagedResult<RevaluationDetailDto>> GetAllAsync(RevaluationDetailQueryDto query, ClaimsPrincipal user);
        Task<RevaluationDetailDto?> GetByIdAsync(int id);
        Task<RevaluationDetailDto> CreateAsync(CreateRevaluationDetailDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
