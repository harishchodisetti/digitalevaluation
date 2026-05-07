namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class RevaluationAssignment
    {
        [Key]
        public int RevaluationAssignmentId { get; set; }

        [Required]
        public int RevaluationRequestId { get; set; }

        [Required]
        public int FacultyId { get; set; }

        public DateTime AssignedDate { get; set; } = DateTime.Now;

        [MaxLength(20)]
        public string? Status { get; set; } // Assigned / InProgress / Completed

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        // Navigation
        public RevaluationRequest? RevaluationRequest { get; set; }
        public Faculty? Faculty { get; set; }
    }
}
