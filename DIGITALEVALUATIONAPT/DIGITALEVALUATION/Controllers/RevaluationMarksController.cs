using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevaluationMarksController : ControllerBase
    {
        private readonly IRevaluationMarkService _service;

        public RevaluationMarksController(IRevaluationMarkService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Evaluator,User")]
        public async Task<IActionResult> Create(CreateRevaluationMarkDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            return Ok(await _service.CreateAsync(dto, userId));
        }

        [HttpPut]
        [Authorize(Roles = "Admin,Evaluator,User")]
        public async Task<IActionResult> Update(UpdateRevaluationMarkDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            return Ok(await _service.UpdateAsync(dto, userId));
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
        public async Task<IActionResult> GetAll([FromQuery] RevaluationMarkFilterDto filter)
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
        [Authorize(Roles = "Admin,Evaluator,User")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            return data == null ? NotFound() : Ok(data);
        }
    }
}
