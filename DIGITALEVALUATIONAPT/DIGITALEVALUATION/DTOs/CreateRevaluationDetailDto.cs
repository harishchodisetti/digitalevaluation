namespace DIGITALEVALUATION.DTOs
{
    public class CreateRevaluationDetailDto
    {
        public int RevaluationRequestId { get; set; }
        public int FacultyId { get; set; }
        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }
        public string? Remarks { get; set; }
    }
}
