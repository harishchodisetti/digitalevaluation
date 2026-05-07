namespace DIGITALEVALUATION.Services
{
    using DIGITALEVALUATION.Contexts;
    using DIGITALEVALUATION.DTOs;
    using DIGITALEVALUATION.Entities;
    using DIGITALEVALUATION.Exceptions;
    using Microsoft.EntityFrameworkCore;
    using OfficeOpenXml;
    using System;
    using System.Linq;

    public class StudentService : IStudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StudentDto>> GetAllAsync()
        {
            return await _context.Students
                .Where(x => !x.IsDeleted)
                .Select(x => new StudentDto
                {
                    StudentId = x.StudentId,
                    RollNumber = x.RollNumber,
                    RegistrationNumber = x.RegistrationNumber,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    CourseId = x.CourseId,
                    BranchId = x.BranchId,
                    CurrentSemester = x.CurrentSemester,
                    Status = x.Status
                }).ToListAsync();
        }

        public async Task<StudentDto> GetByIdAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null || student.IsDeleted)
                throw new NotFoundException("Student not found");

            return new StudentDto
            {
                StudentId = student.StudentId,
                RollNumber = student.RollNumber,
                RegistrationNumber = student.RegistrationNumber,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Email = student.Email,
                CourseId = student.CourseId,
                BranchId = student.BranchId,
                CurrentSemester = student.CurrentSemester,
                Status = student.Status
            };
        }

        public async Task<StudentDto> CreateAsync(StudentCreateDto dto, string user)
        {
            // Unique validation
            if (await _context.Students.AnyAsync(x => x.RollNumber == dto.RollNumber))
                throw new Exception("RollNumber already exists");

            await ValidateFK(dto.CourseId, dto.BranchId);

            var student = new Student
            {
                RollNumber = dto.RollNumber,
                RegistrationNumber = dto.RegistrationNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DOB = dto.DOB,
                BloodGroup = dto.BloodGroup,
                Phone = dto.Phone,
                Email = dto.Email,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                Pincode = dto.Pincode,
                CourseId = dto.CourseId,
                BranchId = dto.BranchId,
                AdmissionYear = dto.AdmissionYear,
                CurrentSemester = dto.CurrentSemester,
                ParentName = dto.ParentName,
                ParentPhone = dto.ParentPhone,
                Status = dto.Status,
                CreatedBy = user
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(student.StudentId);
        }

        public async Task<bool> UpdateAsync(StudentUpdateDto dto, string user)
        {
            var student = await _context.Students.FindAsync(dto.StudentId);

            if (student == null || student.IsDeleted)
                throw new NotFoundException("Student not found");

            await ValidateFK(dto.CourseId, dto.BranchId);

            student.RollNumber = dto.RollNumber;
            student.RegistrationNumber = dto.RegistrationNumber;
            student.FirstName = dto.FirstName;
            student.LastName = dto.LastName;
            student.Email = dto.Email;
            student.CourseId = dto.CourseId;
            student.BranchId = dto.BranchId;
            student.CurrentSemester = dto.CurrentSemester;
            student.Status = dto.Status;
            student.UpdatedBy = user;
            student.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, string user)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
                throw new NotFoundException("Student not found");

            student.IsDeleted = true;
            student.UpdatedBy = user;
            student.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task ValidateFK(int courseId, int branchId)
        {
            if (!await _context.Courses.AnyAsync(x => x.CourseId == courseId && !x.IsDeleted))
                throw new Exception("Invalid CourseId");

            if (!await _context.Branches.AnyAsync(x => x.BranchId == branchId && !x.IsDeleted))
                throw new Exception("Invalid BranchId");
        }
        public async Task<ImportResultDto> ImportStudentsFromExcelAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];
            int rowCount = worksheet.Dimension.Rows;

            var students = new List<Student>();

            for (int row = 2; row <= rowCount; row++) // Skip header
            {
                var student = new Student
                {
                    RollNumber = worksheet.Cells[row, 1].Text,
                    RegistrationNumber = worksheet.Cells[row, 2].Text,
                    FirstName = worksheet.Cells[row, 3].Text,
                    LastName = worksheet.Cells[row, 4].Text,
                    Gender = worksheet.Cells[row, 5].Text,

                    DOB = DateTime.TryParse(worksheet.Cells[row, 6].Text, out DateTime dob) ? dob : null,

                    BloodGroup = worksheet.Cells[row, 7].Text,
                    Phone = worksheet.Cells[row, 8].Text,
                    Email = worksheet.Cells[row, 9].Text,
                    Address = worksheet.Cells[row, 10].Text,
                    City = worksheet.Cells[row, 11].Text,
                    State = worksheet.Cells[row, 12].Text,
                    Pincode = worksheet.Cells[row, 13].Text,

                    CourseId = int.TryParse(worksheet.Cells[row, 14].Text, out int courseId) ? courseId : 0,
                    BranchId = int.TryParse(worksheet.Cells[row, 15].Text, out int branchId) ? branchId : 0,

                    AdmissionYear = int.TryParse(worksheet.Cells[row, 16].Text, out int year) ? year : 0,
                    CurrentSemester = int.TryParse(worksheet.Cells[row, 17].Text, out int sem) ? sem : 0,

                    ParentName = worksheet.Cells[row, 18].Text,
                    ParentPhone = worksheet.Cells[row, 19].Text,
                    Status = worksheet.Cells[row, 20].Text,

                    CreatedDate = DateTime.Now,
                    IsActive = true
                };

                students.Add(student);
            }

            await _context.Students.AddRangeAsync(students);
            await _context.SaveChangesAsync();
            return new ImportResultDto
            {
                TotalRecords = students.Count
            };
          
        }
    }
}
