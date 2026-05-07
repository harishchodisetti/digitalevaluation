using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentAnswersController : ControllerBase
    {
        private readonly IStudentAnswerService _service;

        public StudentAnswersController(IStudentAnswerService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Student,User")]
        public async Task<IActionResult> Create([FromForm] CreateStudentAnswerDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            return Ok(await _service.CreateAsync(dto, userId));
        }

        [HttpPut]
        [Authorize(Roles = "Student,User")]
        public async Task<IActionResult> Update([FromForm] UpdateStudentAnswerDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            return Ok(await _service.UpdateAsync(dto, userId));
        }

        [HttpPut("evaluate")]
        [Authorize(Roles = "Evaluator,Admin,User")]
        public async Task<IActionResult> Evaluate(EvaluateStudentAnswerDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            return Ok(await _service.EvaluateAsync(dto, userId));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result ? Ok("Deleted") : NotFound();
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Evaluator,User")]
        public async Task<IActionResult> GetAll([FromQuery] StudentAnswerFilterDto filter)
        {
            var (data, total) = await _service.GetAllAsync(filter);

            return Ok(new
            {
                TotalCount = total,
                filter.PageNumber,
                filter.PageSize,
                Data = data
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Evaluator,Student,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            return data == null ? NotFound() : Ok(data);
        }
    }
}
