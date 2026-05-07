namespace DIGITALEVALUATION.DTOs
{
    public class CreateExamSectionDto
    {
        public int ExamId { get; set; }
        public string? SectionName { get; set; }
        public int? TotalQuestions { get; set; }
        public int? AnswerRequired { get; set; }
        public decimal? MarksPerQuestion { get; set; }
    }
}
