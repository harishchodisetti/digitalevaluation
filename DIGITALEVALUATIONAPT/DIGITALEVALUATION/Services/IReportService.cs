using DIGITALEVALUATION.DTOs;

namespace DIGITALEVALUATION.Services
{
    public interface IReportService
    {
        Task<PagedResultReport<StudentResultDto>> GetStudentResults(ReportFilterDto filter);
        Task<PagedResultReport<SubjectReportDto>> GetSubjectReport(ReportFilterDto filter);
        Task<EvaluationStatusDto> GetEvaluationStatus(ReportFilterDto filter);
        Task<List<RevaluationReportDto>> GetRevaluationReport(ReportFilterDto filter);
        Task<List<QuestionAnalysisDto>> GetQuestionAnalysis(ReportFilterDto filter);
        Task<DashboardDto> GetDashboard(ReportFilterDto filter);
        Task<List<StudentResultDto>> GetStudentResultsForExport(ReportFilterDto filter);
    }
}
