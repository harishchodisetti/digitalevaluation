namespace DIGITALEVALUATION.DTOs
{
    public class ExamQuestionDto
    {
        public int ExamQuestionId { get; set; }
        public int ExamId { get; set; }
        public int QuestionId { get; set; }
        public string? Section { get; set; }
        public int? QuestionNumber { get; set; }
        public decimal? MaxMarks { get; set; }
        public bool IsCompulsory { get; set; }
    }
}
