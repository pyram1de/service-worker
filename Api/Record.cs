namespace Api
{
    public class Record
    {
        public Record()
        {
            this.Status = "new";
            this.Id = -1;
        }
        public Record(string status, int? id)
        {
            this.Status = status;
            Id = id;
        }

        public string Status { get; set; }
        public int? Id { get; }

        public bool? Check1 { get; set; }
        public bool? Check2 { get; set; }
        public bool? Check3 { get; set; }
    }
}