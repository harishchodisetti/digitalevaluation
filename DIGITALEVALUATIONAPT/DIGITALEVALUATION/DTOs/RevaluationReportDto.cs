namespace DIGITALEVALUATION.DTOs
{
    public class RevaluationReportDto
    {
        public int StudentId { get; set; }
        public decimal? OldMarks { get; set; }
        public decimal? NewMarks { get; set; }
    }
}
