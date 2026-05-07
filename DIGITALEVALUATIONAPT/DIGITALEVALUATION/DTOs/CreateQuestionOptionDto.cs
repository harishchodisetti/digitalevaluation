namespace DIGITALEVALUATION.DTOs
{
    public class CreateQuestionOptionDto
    {
        public int QuestionId { get; set; }
        public string? OptionText { get; set; }
        public bool IsCorrect { get; set; }
    }
}
