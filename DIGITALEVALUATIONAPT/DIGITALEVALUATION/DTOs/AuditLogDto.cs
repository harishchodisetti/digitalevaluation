namespace DIGITALEVALUATION.DTOs
{
    public class AuditLogDto
    {
        public long AuditLogId { get; set; }
        public string? UserName { get; set; }
        public string? Action { get; set; }
        public string? EntityName { get; set; }
        public string? RecordId { get; set; }
        public string? Module { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
