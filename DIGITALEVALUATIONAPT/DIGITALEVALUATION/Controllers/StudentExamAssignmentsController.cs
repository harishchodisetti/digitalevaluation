using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentExamAssignmentsController : ControllerBase
    {
        private readonly IStudentExamAssignmentService _service;

        public StudentExamAssignmentsController(IStudentExamAssignmentService service)
        {
            _service = service;
        }

        // CREATE
        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> Create(StudentExamAssignmentCreateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // UPDATE
        [HttpPut]
        [Authorize(Roles = "Admin,Student,User")]
        public async Task<IActionResult> Update(StudentExamAssignmentUpdateDto dto)
        {
            var result = await _service.UpdateAsync(dto);
            return Ok(result);
        }

        // DELETE
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return Ok(result);
        }

        // GET BY ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Student,Evaluator,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // GET ALL WITH PAGINATION + FILTER
        [HttpGet]
        [Authorize(Roles = "Admin,Evaluator,User")]
        public async Task<IActionResult> GetAll(int page = 1, int pageSize = 10, string? status = null)
        {
            var result = await _service.GetAllAsync(page, pageSize, status);
            return Ok(result);
        }
    }
}
