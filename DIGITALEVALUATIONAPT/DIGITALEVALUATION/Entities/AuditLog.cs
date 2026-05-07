namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;

    public class AuditLog
    {
        [Key]
        public long AuditLogId { get; set; }

        [MaxLength(100)]
        public string? UserId { get; set; }

        [MaxLength(200)]
        public string? UserName { get; set; }

        [MaxLength(100)]
        public string? Action { get; set; } // Create, Update, Delete

        [MaxLength(100)]
        public string? EntityName { get; set; } // Student, Faculty, etc.

        public string? RecordId { get; set; }

        public string? OldValues { get; set; } // JSON
        public string? NewValues { get; set; } // JSON

        [MaxLength(100)]
        public string? IPAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }

        [MaxLength(100)]
        public string? Module { get; set; } // Example: Student Management

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
