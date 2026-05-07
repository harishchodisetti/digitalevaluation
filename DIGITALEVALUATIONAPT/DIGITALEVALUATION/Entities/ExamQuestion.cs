namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class ExamQuestion
    {
        [Key]
        public int ExamQuestionId { get; set; }

        [Required]
        public int ExamId { get; set; }

        [Required]
        public int QuestionId { get; set; }

        [MaxLength(10)]
        public string? Section { get; set; }

        public int? QuestionNumber { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? MaxMarks { get; set; }

        public bool IsCompulsory { get; set; } = true;

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation
        public Exam? Exam { get; set; }
        public Question? Question { get; set; }
    }
}
