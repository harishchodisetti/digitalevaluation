namespace DIGITALEVALUATION.DTOs
{
    public class QuestionDto
    {
        public int QuestionId { get; set; }
        public string? QuestionCode { get; set; }
        public string? QuestionText { get; set; }
        public string? QuestionType { get; set; }
        public string? DifficultyLevel { get; set; }
        public int? SubjectId { get; set; }
        public decimal? MaxMarks { get; set; }
        public bool IsOptional { get; set; }
        public string? Tags { get; set; }
    }
}
