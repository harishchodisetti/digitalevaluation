using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IStudentExamAssignmentService
    {
        Task<StudentExamAssignmentDto> CreateAsync(StudentExamAssignmentCreateDto dto);
        Task<StudentExamAssignmentDto> UpdateAsync(StudentExamAssignmentUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<StudentExamAssignmentDto?> GetByIdAsync(int id);
        Task<IEnumerable<StudentExamAssignmentDto>> GetAllAsync(int page, int pageSize, string? status);
    }
}
