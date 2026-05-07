namespace DIGITALEVALUATION.DTOs
{
    public class AuditLogCreateDto
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Action { get; set; }
        public string? EntityName { get; set; }
        public string? RecordId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? IPAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Module { get; set; }
    }
}
