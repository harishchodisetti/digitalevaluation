namespace DIGITALEVALUATION.DTOs
{
    public class PagedResultReport<T>
    {
        public List<T> Data { get; set; }
        public int TotalRecords { get; set; }
    }
}
