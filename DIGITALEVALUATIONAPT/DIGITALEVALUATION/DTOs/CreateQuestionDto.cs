namespace DIGITALEVALUATION.DTOs
{
    public class CreateQuestionDto
    {
        public string? QuestionCode { get; set; }
        public string? QuestionText { get; set; }
        public string? QuestionImagePath { get; set; }
        public string? QuestionType { get; set; }
        public string? DifficultyLevel { get; set; }

        public int? CollegeId { get; set; }
        public int? CourseId { get; set; }
        public int? BranchId { get; set; }
        public int? SubjectId { get; set; }

        public int? Semester { get; set; }
        public int? UnitNumber { get; set; }

        public decimal? MaxMarks { get; set; }
        public bool IsOptional { get; set; }

        public string? Tags { get; set; }
    }
}
