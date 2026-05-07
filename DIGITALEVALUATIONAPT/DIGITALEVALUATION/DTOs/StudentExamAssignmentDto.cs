namespace DIGITALEVALUATION.DTOs
{
    public class StudentExamAssignmentDto
    {
        public int StudentExamAssignmentId { get; set; }
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public string Status { get; set; }
        public DateTime? ExamDate { get; set; }
    }
}
