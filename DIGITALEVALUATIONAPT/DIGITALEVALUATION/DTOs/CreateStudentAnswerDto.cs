namespace DIGITALEVALUATION.DTOs
{
    public class CreateStudentAnswerDto
    {
        public int AnswerSheetId { get; set; }
        public int QuestionId { get; set; }

        public string? AnswerText { get; set; }

        public IFormFile? File { get; set; }   // FILE UPLOAD
    }
}
