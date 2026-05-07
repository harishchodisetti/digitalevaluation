namespace DIGITALEVALUATION.DTOs
{
    public class ExamSectionQueryDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public int? ExamId { get; set; }
    }

}
