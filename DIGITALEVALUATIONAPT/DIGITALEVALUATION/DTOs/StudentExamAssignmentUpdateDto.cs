namespace DIGITALEVALUATION.DTOs
{
    public class StudentExamAssignmentUpdateDto
    {
        public int StudentExamAssignmentId { get; set; }
        public string Status { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
