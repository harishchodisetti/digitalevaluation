namespace DIGITALEVALUATION.DTOs
{
    public class RevaluationDetailQueryDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public int? FacultyId { get; set; }
        public int? RevaluationRequestId { get; set; }
    }
}
