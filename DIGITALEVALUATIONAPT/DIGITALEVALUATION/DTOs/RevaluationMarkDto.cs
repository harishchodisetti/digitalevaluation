namespace DIGITALEVALUATION.DTOs
{
    public class RevaluationMarkDto
    {
        public int Id { get; set; }
        public int RevaluationDetailId { get; set; }
        public int QuestionId { get; set; }

        public string QuestionText { get; set; }

        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
