namespace DIGITALEVALUATION.DTOs
{
    public class QuestionOptionDto
    {
        public int OptionId { get; set; }
        public int QuestionId { get; set; }
        public string? OptionText { get; set; }
        public bool IsCorrect { get; set; }
    }
}
