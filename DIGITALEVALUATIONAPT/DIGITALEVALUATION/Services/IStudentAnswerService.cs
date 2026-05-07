using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IStudentAnswerService
    {
        Task<StudentAnswerDto> CreateAsync(CreateStudentAnswerDto dto, string userId);
        Task<StudentAnswerDto> UpdateAsync(UpdateStudentAnswerDto dto, string userId);
        Task<StudentAnswerDto> EvaluateAsync(EvaluateStudentAnswerDto dto, string userId);
        Task<bool> DeleteAsync(int id);

        Task<StudentAnswerDto?> GetByIdAsync(int id);
        Task<(IEnumerable<StudentAnswerDto>, int)> GetAllAsync(StudentAnswerFilterDto filter);
    }
}
