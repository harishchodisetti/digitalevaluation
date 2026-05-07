using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Faculty,User")]
    public class QuestionOptionsController : ControllerBase
    {
        private readonly IQuestionOptionService _service;

        public QuestionOptionsController(IQuestionOptionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QuestionOptionQueryDto query)
        {
            var data = await _service.GetAllAsync(query);
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateQuestionOptionDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateQuestionOptionDto dto)
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
