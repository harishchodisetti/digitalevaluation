using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DIGITALEVALUATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Faculty,User")]
    public class ExamQuestionsController : ControllerBase
    {
        private readonly IExamQuestionService _service;

        public ExamQuestionsController(IExamQuestionService service)
        {
            _service = service;
        }
        private string GetUser()
        {
            return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ExamQuestionQueryDto query)
        {
            var result = await _service.GetAllAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateExamQuestionDto dto)
        {
            var user = GetUser();
            var result = await _service.CreateAsync(dto, user);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateExamQuestionDto dto)
        {
            var updated = await _service.UpdateAsync(dto);
            if (!updated) return NotFound();
            return Ok("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return Ok("Deleted Successfully");
        }
    }
}
