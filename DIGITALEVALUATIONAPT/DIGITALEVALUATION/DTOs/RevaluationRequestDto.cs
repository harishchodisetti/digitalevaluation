namespace DIGITALEVALUATION.DTOs
{
    public class RevaluationRequestDto
    {
        public int RevaluationRequestId { get; set; }
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public int SubjectId { get; set; }
        public decimal? OriginalMarks { get; set; }
        public string? Reason { get; set; }
        public DateTime RequestDate { get; set; }
        public string? Status { get; set; }
        public string? Remarks { get; set; }
    }
}
