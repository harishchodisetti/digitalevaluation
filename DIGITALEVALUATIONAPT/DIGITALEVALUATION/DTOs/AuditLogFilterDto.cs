namespace DIGITALEVALUATION.DTOs
{
    public class AuditLogFilterDto
    {
        public string? UserName { get; set; }
        public string? Action { get; set; }
        public string? EntityName { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
