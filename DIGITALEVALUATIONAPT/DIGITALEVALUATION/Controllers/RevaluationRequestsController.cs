using DIGITALEVALUATION.DTOs;
using DIGITALEVALUATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevaluationRequestsController : ControllerBase
    {
        private readonly IRevaluationRequestService _service;

        public RevaluationRequestsController(IRevaluationRequestService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Student,User")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
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
        [Authorize(Roles = "Admin,Student,User")]
        public async Task<IActionResult> Create(CreateRevaluationRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("status")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UpdateStatus(UpdateRevaluationStatusDto dto)
        {
            var updated = await _service.UpdateStatusAsync(dto);
            if (!updated) return NotFound();
            return Ok("Status Updated Successfully");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return Ok("Deleted Successfully");
        }
    }
}
