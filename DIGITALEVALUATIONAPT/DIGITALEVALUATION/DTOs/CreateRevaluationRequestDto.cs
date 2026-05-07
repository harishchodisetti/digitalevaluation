namespace DIGITALEVALUATION.DTOs
{
    public class CreateRevaluationRequestDto
    {
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public int SubjectId { get; set; }
        public decimal? OriginalMarks { get; set; }
        public string? Reason { get; set; }
    }
}
