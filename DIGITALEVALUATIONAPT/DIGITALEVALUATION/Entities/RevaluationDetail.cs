namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class RevaluationDetail
    {
        [Key]
        public int RevaluationDetailId { get; set; }

        [Required]
        public int RevaluationRequestId { get; set; }

        [Required]
        public int FacultyId { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? OldMarks { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? NewMarks { get; set; }

        //  Computed Column
       // [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? DifferenceMarks { get; private set; }

        public DateTime? EvaluatedDate { get; set; }

        [MaxLength(500)]
        public string? Remarks { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        // Navigation
        [ForeignKey("RevaluationRequestId")]
        public RevaluationRequest? RevaluationRequest { get; set; }
        [ForeignKey("FacultyId")]
        public Faculty? Faculty { get; set; }
    }
}
