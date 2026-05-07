namespace DIGITALEVALUATION.DTOs
{
    public class UpdateAssignmentStatusDto
    {
        public int RevaluationAssignmentId { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
