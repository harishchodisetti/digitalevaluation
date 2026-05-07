namespace DIGITALEVALUATION.DTOs
{
    public class PagedResultAuditLog<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalRecords { get; set; }   // ← Required
        public int PageNumber { get; set; }     // ← Required
        public int PageSize { get; set; }       // ← Required
    }
}
