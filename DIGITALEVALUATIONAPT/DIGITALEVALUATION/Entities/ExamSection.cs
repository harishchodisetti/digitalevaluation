namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class ExamSection 
    {
        [Key]
        public int SectionId { get; set; }

        [Required]
        public int ExamId { get; set; }

        [MaxLength(50)]
        public string? SectionName { get; set; }

        public int? TotalQuestions { get; set; }
        public int? AnswerRequired { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? MarksPerQuestion { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public Exam? Exam { get; set; }
    }
}
