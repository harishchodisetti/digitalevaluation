namespace DIGITALEVALUATION.DTOs
{
    public class ActivityLogFilterDto
    {
        public string? UserName { get; set; }
        public string? ActivityType { get; set; }
        public string? Module { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
