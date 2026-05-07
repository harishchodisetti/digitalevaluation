namespace DIGITALEVALUATION.Services
{
    using DIGITALEVALUATION.DTOs;
    using iText.Kernel.Pdf;
    using iText.Layout;
    using iText.Layout.Element;
    using OfficeOpenXml;

    public class ExportService : IExportService
    {
        // ✅ EXCEL EXPORT
        public byte[] ExportStudentResultsToExcel(List<StudentResultDto> data)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var package = new ExcelPackage();
            var sheet = package.Workbook.Worksheets.Add("Student Results");

            // Header
            sheet.Cells[1, 1].Value = "StudentId";
            sheet.Cells[1, 2].Value = "Name";
            sheet.Cells[1, 3].Value = "ExamId";
            sheet.Cells[1, 4].Value = "Total";
            sheet.Cells[1, 5].Value = "Obtained";
            sheet.Cells[1, 6].Value = "Percentage";

            int row = 2;

            foreach (var item in data)
            {
                sheet.Cells[row, 1].Value = item.StudentId;
                sheet.Cells[row, 2].Value = item.StudentName;
                sheet.Cells[row, 3].Value = item.ExamId;
                sheet.Cells[row, 4].Value = item.TotalMarks;
                sheet.Cells[row, 5].Value = item.ObtainedMarks;
                sheet.Cells[row, 6].Value = item.Percentage;
                row++;
            }

            return package.GetAsByteArray();
        }

        // ✅ PDF EXPORT
        public byte[] ExportStudentResultsToPdf(List<StudentResultDto> data)
        {
            using var stream = new MemoryStream();
            var writer = new PdfWriter(stream);
            var pdf = new PdfDocument(writer);
            var document = new Document(pdf);

            document.Add(new Paragraph("Student Results Report"));

            var table = new Table(6);

            table.AddCell("StudentId");
            table.AddCell("Name");
            table.AddCell("ExamId");
            table.AddCell("Total");
            table.AddCell("Obtained");
            table.AddCell("Percentage");

            foreach (var item in data)
            {
                table.AddCell(item.StudentId.ToString());
                table.AddCell(item.StudentName);
                table.AddCell(item.ExamId.ToString());
                table.AddCell(item.TotalMarks.ToString());
                table.AddCell(item.ObtainedMarks.ToString());
                table.AddCell(item.Percentage.ToString());
            }

            document.Add(table);
            document.Close();

            return stream.ToArray();
        }

    }
}
