namespace DIGITALEVALUATION.Services
{
    using DIGITALEVALUATION.Contexts;
    using DIGITALEVALUATION.DTOs;
    using DIGITALEVALUATION.Entities;
    using DIGITALEVALUATION.Exceptions;
    using Microsoft.EntityFrameworkCore;
    using OfficeOpenXml;
    using System;

    public class FacultyService : IFacultyService
    {
        private readonly ApplicationDbContext _context;

        public FacultyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FacultyDto>> GetAllAsync()
        {
            return await _context.Faculties
                .Where(x => !x.IsDeleted)
                .Select(x => new FacultyDto
                {
                    FacultyId = x.FacultyId,
                    EmployeeCode = x.EmployeeCode,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    Designation = x.Designation,
                    BranchId = x.BranchId,
                    Salary = x.Salary
                }).ToListAsync();
        }

        public async Task<FacultyDto> GetByIdAsync(int id)
        {
            var faculty = await _context.Faculties.FindAsync(id);

            if (faculty == null || faculty.IsDeleted)
                throw new NotFoundException("Faculty not found");

            return new FacultyDto
            {
                FacultyId = faculty.FacultyId,
                EmployeeCode = faculty.EmployeeCode,
                FirstName = faculty.FirstName,
                LastName = faculty.LastName,
                Email = faculty.Email,
                Designation = faculty.Designation,
                BranchId = faculty.BranchId,
                Salary = faculty.Salary
            };
        }

        public async Task<FacultyDto> CreateAsync(FacultyCreateDto dto, string user)
        {
            // Unique validation
            if (await _context.Faculties.AnyAsync(x => x.EmployeeCode == dto.EmployeeCode))
                throw new Exception("EmployeeCode already exists");

            await ValidateBranch(dto.BranchId);

            var faculty = new Faculty
            {
                EmployeeCode = dto.EmployeeCode,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                Phone = dto.Phone,
                Email = dto.Email,
                Qualification = dto.Qualification,
                ExperienceYears = dto.ExperienceYears,
                DateOfJoining = dto.DateOfJoining,
                Designation = dto.Designation,
                BranchId = dto.BranchId,
                Salary = dto.Salary,
                CreatedBy = user
            };

            _context.Faculties.Add(faculty);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(faculty.FacultyId);
        }

        public async Task<bool> UpdateAsync(FacultyUpdateDto dto, string user)
        {
            var faculty = await _context.Faculties.FindAsync(dto.FacultyId);

            if (faculty == null || faculty.IsDeleted)
                throw new NotFoundException("Faculty not found");

            await ValidateBranch(dto.BranchId);

            faculty.EmployeeCode = dto.EmployeeCode;
            faculty.FirstName = dto.FirstName;
            faculty.LastName = dto.LastName;
            faculty.Email = dto.Email;
            faculty.Designation = dto.Designation;
            faculty.BranchId = dto.BranchId;
            faculty.Salary = dto.Salary;
            faculty.UpdatedBy = user;
            faculty.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, string user)
        {
            var faculty = await _context.Faculties.FindAsync(id);

            if (faculty == null)
                throw new NotFoundException("Faculty not found");

            faculty.IsDeleted = true;
            faculty.UpdatedBy = user;
            faculty.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task ValidateBranch(int branchId)
        {
            if (!await _context.Branches.AnyAsync(x => x.BranchId == branchId && !x.IsDeleted))
                throw new Exception("Invalid BranchId");
        }
        public async Task<ImportResultDto> ImportFacultiesFromExcelAsync(
        IFormFile file,
        bool skipDuplicates = true,
        bool updateIfExists = false)
        {
            var result = new ImportResultDto();

            if (file == null || file.Length == 0)
            {
                result.Errors.Add("File is empty");
                return result;
            }

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];
            int rowCount = worksheet.Dimension.Rows;

            result.TotalRecords = rowCount - 1;

            var facultiesToAdd = new List<Faculty>();

            // Optimization
            _context.ChangeTracker.AutoDetectChangesEnabled = false;

            for (int row = 2; row <= rowCount; row++)
            {
                try
                {
                    string employeeCode = worksheet.Cells[row, 1].Text?.Trim();

                    if (string.IsNullOrEmpty(employeeCode))
                    {
                        result.Errors.Add($"Row {row}: EmployeeCode is required");
                        result.FailedCount++;
                        continue;
                    }

                    var existingFaculty = await _context.Faculties
                        .FirstOrDefaultAsync(x => x.EmployeeCode == employeeCode);

                    // Duplicate Handling
                    if (existingFaculty != null)
                    {
                        if (skipDuplicates)
                        {
                            result.FailedCount++;
                            continue;
                        }

                        if (updateIfExists)
                        {
                            MapFaculty(existingFaculty, worksheet, row);
                            existingFaculty.UpdatedDate = DateTime.Now;

                            result.SuccessCount++;
                            continue;
                        }
                    }

                    var faculty = new Faculty();
                    MapFaculty(faculty, worksheet, row);

                    faculty.CreatedDate = DateTime.Now;
                    faculty.IsActive = true;

                    facultiesToAdd.Add(faculty);
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    result.Errors.Add($"Row {row}: {ex.Message}");
                    result.FailedCount++;
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (facultiesToAdd.Any())
                    await _context.Faculties.AddRangeAsync(facultiesToAdd);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                result.Errors.Add($"Database Error: {ex.Message}");
            }

            return result;
        }

        private void MapFaculty(Faculty faculty, ExcelWorksheet worksheet, int row)
        {
            faculty.EmployeeCode = worksheet.Cells[row, 1].Text;
            faculty.FirstName = worksheet.Cells[row, 2].Text;
            faculty.LastName = worksheet.Cells[row, 3].Text;
            faculty.Gender = worksheet.Cells[row, 4].Text;
            faculty.Phone = worksheet.Cells[row, 5].Text;
            faculty.Email = worksheet.Cells[row, 6].Text;
            faculty.Qualification = worksheet.Cells[row, 7].Text;

            faculty.ExperienceYears = int.TryParse(worksheet.Cells[row, 8].Text, out int exp)
                ? exp : 0;

            faculty.DateOfJoining = DateTime.TryParse(worksheet.Cells[row, 9].Text, out DateTime doj)
                ? doj : null;

            faculty.Designation = worksheet.Cells[row, 10].Text;

            faculty.BranchId = int.TryParse(worksheet.Cells[row, 11].Text, out int branchId)
                ? branchId : 0;

            faculty.Salary = decimal.TryParse(worksheet.Cells[row, 12].Text, out decimal salary)
                ? salary : 0;
        }

        // Optional: Download Template
        public async Task<byte[]> DownloadFacultyTemplateAsync()
        {
            using var package = new ExcelPackage();
            var sheet = package.Workbook.Worksheets.Add("FacultyTemplate");

            // Headers
            sheet.Cells[1, 1].Value = "EmployeeCode";
            sheet.Cells[1, 2].Value = "FirstName";
            sheet.Cells[1, 3].Value = "LastName";
            sheet.Cells[1, 4].Value = "Gender";
            sheet.Cells[1, 5].Value = "Phone";
            sheet.Cells[1, 6].Value = "Email";
            sheet.Cells[1, 7].Value = "Qualification";
            sheet.Cells[1, 8].Value = "ExperienceYears";
            sheet.Cells[1, 9].Value = "DateOfJoining";
            sheet.Cells[1, 10].Value = "Designation";
            sheet.Cells[1, 11].Value = "BranchId";
            sheet.Cells[1, 12].Value = "Salary";

            return await package.GetAsByteArrayAsync();
        }
    }
}
