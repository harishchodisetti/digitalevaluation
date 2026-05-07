using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;
        private readonly IExportService _exportService;

        public ReportsController(IReportService reportService, IExportService exportService)
        {
            _service = reportService;
            _exportService = exportService;
        }

        [HttpPost("student")]
        public async Task<IActionResult> Student([FromBody] ReportFilterDto filter)
            => Ok(await _service.GetStudentResults(filter));

        [HttpPost("subject")]
        public async Task<IActionResult> Subject([FromBody] ReportFilterDto filter)
            => Ok(await _service.GetSubjectReport(filter));

        [HttpPost("evaluation")]
        public async Task<IActionResult> Evaluation([FromBody] ReportFilterDto filter)
            => Ok(await _service.GetEvaluationStatus(filter));

        [HttpPost("revaluation")]
        public async Task<IActionResult> Revaluation([FromBody] ReportFilterDto filter)
            => Ok(await _service.GetRevaluationReport(filter));

        [HttpPost("question")]
        public async Task<IActionResult> Question([FromBody] ReportFilterDto filter)
            => Ok(await _service.GetQuestionAnalysis(filter));

        [HttpPost("dashboard")]
        public async Task<IActionResult> Dashboard([FromBody] ReportFilterDto filter)
            => Ok(await _service.GetDashboard(filter));
        // 📊 EXCEL EXPORT
        [HttpPost("student/export/excel")]
        public async Task<IActionResult> ExportExcel([FromBody] ReportFilterDto filter)
        {
            var data = await _service.GetStudentResultsForExport(filter);
            var file = _exportService.ExportStudentResultsToExcel(data);

            return File(file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "StudentResults.xlsx");
        }

        // 📄 PDF EXPORT
        [HttpPost("student/export/pdf")]
        public async Task<IActionResult> ExportPdf([FromBody] ReportFilterDto filter)
        {
            var data = await _service.GetStudentResultsForExport(filter);
            var file = _exportService.ExportStudentResultsToPdf(data);

            return File(file,
                "application/pdf",
                "StudentResults.pdf");
        }
    }
}
