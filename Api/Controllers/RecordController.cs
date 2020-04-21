using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecordController : ControllerBase
    {
        [HttpPost]
        public Record New()
        {
            return new Record();
        }

        [HttpPut]
        public Record Update([FromBody] Record record)
        {
            return SaveService.Save(record);
        }
    }
}