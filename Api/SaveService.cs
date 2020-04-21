namespace Api
{
    public static class SaveService
    {
        public static Record Save(Record record)
        {
            if (record.Check3 == true)
            {
                record.Status = "CLOSED";
            } else if (record.Check2 == true)
            {
                record.Status = "Awaiting Sign Off";
            } else if (record.Check1 == true)
            {
                record.Status = "In Progress";
            }
            return record;
        }
    }
}