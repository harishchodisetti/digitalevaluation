using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DIGITALEVALUATION.Entities
{
    public class RevaluationMark
    {
        [Key]
        public int Id { get; set; }

        public int RevaluationDetailId { get; set; }
        public int QuestionId { get; set; }

        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        // Navigation

        [ForeignKey("RevaluationDetailId")]
        public RevaluationDetail RevaluationDetail { get; set; }

        [ForeignKey("QuestionId")]
        public Question Question { get; set; }
    }
}
