using DIGITALEVALUATION.Contexts;
using DIGITALEVALUATION.DTOs;
using Microsoft.EntityFrameworkCore;

namespace DIGITALEVALUATION.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<StudentResultDto>> GetStudentResultsForExport(ReportFilterDto filter)
        {
            return await _context.AnswerSheets
                .Include(x => x.Student)
                .Include(x => x.StudentAnswers).ThenInclude(a => a.Question)
                .Where(x => !filter.ExamId.HasValue || x.ExamId == filter.ExamId)
                .Select(x => new StudentResultDto
                {
                    StudentId = x.StudentId,
                    StudentName = x.Student.FirstName,
                    ExamId = x.ExamId,
                    TotalMarks = x.StudentAnswers.Sum(a => a.Question.MaxMarks ?? 0),
                    ObtainedMarks = x.StudentAnswers.Sum(a => a.MarksAwarded ?? 0),
                    Percentage = x.StudentAnswers.Sum(a => a.Question.MaxMarks ?? 1) == 0 ? 0 :
                        (x.StudentAnswers.Sum(a => a.MarksAwarded ?? 0) * 100 /
                         x.StudentAnswers.Sum(a => a.Question.MaxMarks ?? 1))
                })
                .ToListAsync();
        }
        // STUDENT RESULT
        public async Task<PagedResultReport<StudentResultDto>> GetStudentResults(ReportFilterDto filter)
        {
            var query = _context.AnswerSheets
                .Include(x => x.Student)
                .Include(x => x.StudentAnswers).ThenInclude(a => a.Question)
                .AsQueryable();

            if (filter.ExamId.HasValue)
                query = query.Where(x => x.ExamId == filter.ExamId);

            if (!string.IsNullOrEmpty(filter.Search))
                query = query.Where(x => x.Student.FirstName.Contains(filter.Search));

            var total = await query.CountAsync();

            var data = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(x => new StudentResultDto
                {
                    StudentId = x.StudentId,
                    StudentName = x.Student.FirstName,
                    ExamId = x.ExamId,
                    TotalMarks = x.StudentAnswers.Sum(a => a.Question.MaxMarks ?? 0),
                    ObtainedMarks = x.StudentAnswers.Sum(a => a.MarksAwarded ?? 0),
                    Percentage = x.StudentAnswers.Sum(a => a.Question.MaxMarks ?? 1) == 0 ? 0 :
                        (x.StudentAnswers.Sum(a => a.MarksAwarded ?? 0) * 100 /
                         x.StudentAnswers.Sum(a => a.Question.MaxMarks ?? 1))
                })
                .ToListAsync();

            return new PagedResultReport<StudentResultDto> { Data = data, TotalRecords = total };
        }

        //  SUBJECT REPORT
        public async Task<PagedResultReport<SubjectReportDto>> GetSubjectReport(ReportFilterDto filter)
        {
            var query = _context.StudentAnswers
                .Include(x => x.Question)
                .ThenInclude(q => q.Subject)
                .AsQueryable();

            if (filter.ExamId.HasValue)
                query = query.Where(x => x.AnswerSheet.ExamId == filter.ExamId);

            var grouped = query.GroupBy(x => x.Question.Subject.SubjectName);

            var total = await grouped.CountAsync();

            var data = await grouped
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(g => new SubjectReportDto
                {
                    SubjectName = g.Key,
                    AverageMarks = g.Average(x => x.MarksAwarded ?? 0)
                }).ToListAsync();

            return new PagedResultReport<SubjectReportDto> { Data = data, TotalRecords = total };
        }

        // EVALUATION STATUS
        public async Task<EvaluationStatusDto> GetEvaluationStatus(ReportFilterDto filter)
        {
            var total = await _context.AnswerSheets.CountAsync(x => x.ExamId == filter.ExamId);
            var completed = await _context.AnswerSheets.CountAsync(x => x.ExamId == filter.ExamId && x.Status== "Evaluated");

            return new EvaluationStatusDto
            {
                Total = total,
                Completed = completed,
                Pending = total - completed
            };
        }

        //  REVALUATION REPORT
        public async Task<List<RevaluationReportDto>> GetRevaluationReport(ReportFilterDto filter)
        {
            return await _context.RevaluationMarks
                .Where(x => x.RevaluationDetail.RevaluationRequest.ExamId == filter.ExamId)
                .Select(x => new RevaluationReportDto
                {
                    StudentId = x.RevaluationDetail.RevaluationRequest.StudentId,
                    OldMarks = x.OldMarks,
                    NewMarks = x.NewMarks
                }).ToListAsync();
        }

        //  QUESTION ANALYSIS
        public async Task<List<QuestionAnalysisDto>> GetQuestionAnalysis(ReportFilterDto filter)
        {
            return await _context.StudentAnswers
                .Where(x => x.AnswerSheet.ExamId == filter.ExamId)
                .GroupBy(x => x.QuestionId)
                .Select(g => new QuestionAnalysisDto
                {
                    QuestionId = g.Key,
                    AvgMarks = g.Average(x => x.MarksAwarded ?? 0)
                }).ToListAsync();
        }

        //  DASHBOARD
        public async Task<DashboardDto> GetDashboard(ReportFilterDto filter)
        {
            var totalStudents = await _context.AnswerSheets
                .Where(x => x.ExamId == filter.ExamId)
                .Select(x => x.StudentId)
                .Distinct()
                .CountAsync();

            var passCount = await _context.AnswerSheets
                .Where(x => x.ExamId == filter.ExamId )
                .CountAsync();

            return new DashboardDto
            {
                TotalStudents = totalStudents,
                TotalExams = await _context.Exams.CountAsync(),
                PassPercentage = totalStudents == 0 ? 0 : (passCount * 100m / totalStudents)
            };
        }
    }
}
