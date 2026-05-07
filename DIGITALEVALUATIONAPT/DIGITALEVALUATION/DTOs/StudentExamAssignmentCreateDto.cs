namespace DIGITALEVALUATION.DTOs
{
    public class StudentExamAssignmentCreateDto
    {
        // Core Mapping
        public int StudentId { get; set; }
        public int ExamId { get; set; }

        // Scheduling
        public DateTime? ExamDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        // Status Lifecycle
        public string Status { get; set; } = "Assigned";
        // Assigned, InProgress, Completed, Absent

        // Attempt Handling
        public int AttemptNumber { get; set; } = 1;

        // Revaluation
        public bool IsRevaluationRequested { get; set; } = false;

        // Optional Flags
        public bool IsActive { get; set; } = true;

        // Audit Fields
        public string? CreatedBy { get; set; }

        // (Optional – only if you want manual override)
        public DateTime? AssignedDate { get; set; }
    }
}
