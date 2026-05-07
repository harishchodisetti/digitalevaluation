namespace DIGITALEVALUATION.DTOs
{
    public class QuestionQueryDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public int? SubjectId { get; set; }
        public int? BranchId { get; set; }
        public int? CourseId { get; set; }
        public int? CollegeId { get; set; }

        public string? QuestionType { get; set; }
        public string? DifficultyLevel { get; set; }

        public int? Semester { get; set; }
        public int? UnitNumber { get; set; }

        public string? Search { get; set; } // 🔍 text search
    }
}
