namespace DIGITALEVALUATION.DTOs
{
    public class StudentAnswerDto
    {
        public int StudentAnswerId { get; set; }
        public int AnswerSheetId { get; set; }
        public int QuestionId { get; set; }

        public string QuestionText { get; set; }
        public string? AnswerText { get; set; }

        public string? FilePath { get; set; }

        public decimal? MarksAwarded { get; set; }
        public string? EvaluatorRemarks { get; set; }

        public string EvaluatorName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
