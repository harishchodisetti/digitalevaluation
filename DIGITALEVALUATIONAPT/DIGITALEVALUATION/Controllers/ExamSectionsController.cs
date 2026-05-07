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
    public class ExamSectionsController : ControllerBase
    {
        private readonly IExamSectionService _service;

        public ExamSectionsController(IExamSectionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ExamSectionQueryDto query)
        {
            return Ok(await _service.GetAllAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateExamSectionDto dto)
        {
            var result = await _service.CreateAsync(dto, User);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateExamSectionDto dto)
        {
            var updated = await _service.UpdateAsync(dto, User);
            if (!updated) return NotFound();
            return Ok("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id, User);
            if (!deleted) return NotFound();
            return Ok("Deleted Successfully");
        }
    }
}
