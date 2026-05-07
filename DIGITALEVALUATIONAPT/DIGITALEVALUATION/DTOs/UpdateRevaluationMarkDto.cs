namespace DIGITALEVALUATION.DTOs
{
    public class UpdateRevaluationMarkDto
    {
        public int Id { get; set; }

        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }
    }
}
