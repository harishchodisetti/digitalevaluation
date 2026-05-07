using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DIGITALEVALUATION.Controllers
{
    using DIGITALEVALUATION.DTOs;
    using DIGITALEVALUATION.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Faculty,User")]
    public class AuditLogController : ControllerBase
    {
        private readonly IAuditLogService _auditService;

        public AuditLogController(IAuditLogService auditService)
        {
            _auditService = auditService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(AuditLogCreateDto dto)
        {
            await _auditService.CreateAsync(dto);
            return Ok("Audit log created");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _auditService.GetAllAsync();
            return Ok(data);
        }

        [HttpPost("paged")]
        public async Task<IActionResult> GetPaged(AuditLogFilterDto filter)
        {
            var result = await _auditService.GetPagedAsync(filter);
            return Ok(result);
        }
    }
}
