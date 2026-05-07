namespace DIGITALEVALUATION.DTOs
{
    public class ActivityLogCreateDto
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? ActivityType { get; set; }
        public string? Module { get; set; }
        public string? Description { get; set; }
        public string? IPAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Path { get; set; }
        public string? Method { get; set; }
        public int? StatusCode { get; set; }
    }
}
