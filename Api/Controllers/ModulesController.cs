using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ModulesController : ControllerBase
    {
        private static readonly string[] Modules;

        static ModulesController()
        {
            Modules = new[] {
                "AC", "AI", "PASS"
            };
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return Modules;
        }
    }
}