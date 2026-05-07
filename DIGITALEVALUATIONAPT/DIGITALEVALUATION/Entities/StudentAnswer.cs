using System.ComponentModel.DataAnnotations.Schema;

namespace DIGITALEVALUATION.Entities
{
    public class StudentAnswer
    {
        public int StudentAnswerId { get; set; }

        public int AnswerSheetId { get; set; }
        public int QuestionId { get; set; }

        public string? AnswerText { get; set; }
        public string? FilePath { get; set; }

        public decimal? MarksAwarded { get; set; }
        public string? EvaluatorRemarks { get; set; }

        public int? EvaluatedBy { get; set; }
        public DateTime? EvaluatedDate { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        [ForeignKey("AnswerSheetId")]
        public AnswerSheet AnswerSheet { get; set; }

        [ForeignKey("QuestionId")]
        public Question Question { get; set; }

      

    }

}
