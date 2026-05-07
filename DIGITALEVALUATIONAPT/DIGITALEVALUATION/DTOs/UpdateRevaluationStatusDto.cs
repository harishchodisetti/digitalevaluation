namespace DIGITALEVALUATION.DTOs
{
    public class UpdateRevaluationStatusDto
    {
        public int RevaluationRequestId { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? ApprovedBy { get; set; }
        public string? Remarks { get; set; }
    }
}
