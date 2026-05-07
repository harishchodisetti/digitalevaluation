namespace DIGITALEVALUATION.DTOs
{
    public class UpdateStudentAnswerDto
    {
        public int StudentAnswerId { get; set; }
        public string? AnswerText { get; set; }
        public IFormFile? File { get; set; }
    }
}
