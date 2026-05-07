namespace DIGITALEVALUATION.DTOs
{
    public class RevaluationAssignmentDto
    {
        public int RevaluationAssignmentId { get; set; }
        public int RevaluationRequestId { get; set; }
        public int FacultyId { get; set; }
        public DateTime AssignedDate { get; set; }
        public string? Status { get; set; }
    }
}
