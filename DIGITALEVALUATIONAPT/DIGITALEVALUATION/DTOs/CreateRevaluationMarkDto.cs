namespace DIGITALEVALUATION.DTOs
{
    public class CreateRevaluationMarkDto
    {
        public int RevaluationDetailId { get; set; }
        public int QuestionId { get; set; }

        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }
    }
}
