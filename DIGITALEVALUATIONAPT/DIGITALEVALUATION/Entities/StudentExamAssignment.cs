namespace DIGITALEVALUATION.Entities
{
    public class StudentExamAssignment
    {
        public int StudentExamAssignmentId { get; set; }

        public int StudentId { get; set; }
        public int ExamId { get; set; }

        public DateTime AssignedDate { get; set; } = DateTime.Now;
        public DateTime? ExamDate { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public string Status { get; set; } = "Assigned";
        // Assigned, InProgress, Completed, Absent, Evaluated

        public int AttemptNumber { get; set; } = 1;

        public bool IsRevaluationRequested { get; set; } = false;

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
