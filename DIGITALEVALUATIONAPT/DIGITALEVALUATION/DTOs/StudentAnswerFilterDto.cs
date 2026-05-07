namespace DIGITALEVALUATION.DTOs
{
    public class StudentAnswerFilterDto
    {
        public int? AnswerSheetId { get; set; }
        public int? QuestionId { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
