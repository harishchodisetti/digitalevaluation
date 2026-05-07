namespace DIGITALEVALUATION.DTOs
{
    public class EvaluateStudentAnswerDto
    {
        public int StudentAnswerId { get; set; }
        public decimal MarksAwarded { get; set; }
        public string? EvaluatorRemarks { get; set; }
    }
}
