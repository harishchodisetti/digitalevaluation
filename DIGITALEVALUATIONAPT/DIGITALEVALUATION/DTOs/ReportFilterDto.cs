namespace DIGITALEVALUATION.DTOs
{
    public class ReportFilterDto
    {
        public int? StudentId { get; set; }
        public int? ExamId { get; set; }
        public int? SubjectId { get; set; }
        public int? EvaluatorId { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public string? Search { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
