using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IExportService
    {
        byte[] ExportStudentResultsToExcel(List<StudentResultDto> data);
        byte[] ExportStudentResultsToPdf(List<StudentResultDto> data);
    }
}
