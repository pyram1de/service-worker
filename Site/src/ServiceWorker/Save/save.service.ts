export class SaveService {
    public static save(record: any) : any {
        if(record.check3 === true) {
            record.status = 'CLOSED';
        } else if(record.check2 === true) {
            record.status = 'Awaiting Sign Off';
        } else if(record.check1 === true) {
            record.status = 'In Progress';
        }
        return record;
    }
}
