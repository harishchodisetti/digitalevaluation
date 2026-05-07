namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class RevaluationRequest
    {
        [Key]
        public int RevaluationRequestId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ExamId { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? OriginalMarks { get; set; }

        [MaxLength(500)]
        public string? Reason { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.Now;

        [MaxLength(20)]
        public string? Status { get; set; } // Pending / Approved / Rejected / Completed

        public int? ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [MaxLength(500)]
        public string? Remarks { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        // Navigation (optional)
        public Student? Student { get; set; }
        public Exam? Exam { get; set; }
        public Subject? Subject { get; set; }
    }
}
