using DIGITALEVALUATION.DTOs;
using System.Security.Claims;

namespace DIGITALEVALUATION.Services
{
    public interface IExamSectionService
    {
        Task<PagedResult<ExamSectionDto>> GetAllAsync(ExamSectionQueryDto query);
        Task<ExamSectionDto?> GetByIdAsync(int id);
        Task<ExamSectionDto> CreateAsync(CreateExamSectionDto dto, ClaimsPrincipal user);
        Task<bool> UpdateAsync(UpdateExamSectionDto dto, ClaimsPrincipal user);
        Task<bool> DeleteAsync(int id, ClaimsPrincipal user);
    }
}
