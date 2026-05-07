namespace DIGITALEVALUATION.DTOs
{
    public class RevaluationDetailDto
    {
        public int RevaluationDetailId { get; set; }
        public int RevaluationRequestId { get; set; }
        public int FacultyId { get; set; }
        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }
        public decimal? DifferenceMarks { get; set; }
        public DateTime? EvaluatedDate { get; set; }
        public string? Remarks { get; set; }
    }
}
