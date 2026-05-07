namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;

    public class ActivityLog
    {
        [Key]
        public long ActivityLogId { get; set; }

        [MaxLength(100)]
        public string? UserId { get; set; }

        [MaxLength(150)]
        public string? UserName { get; set; }

        [MaxLength(100)]
        public string? ActivityType { get; set; } // Login, Logout, Create, View, etc.

        [MaxLength(200)]
        public string? Module { get; set; } // Student, Faculty, Exam, etc.

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? IPAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }

        [MaxLength(200)]
        public string? Path { get; set; } // API URL

        [MaxLength(10)]
        public string? Method { get; set; } // GET, POST

        public int? StatusCode { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
