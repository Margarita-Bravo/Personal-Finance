export class Ingreso{
    id!: number;
    amount:number;
    date?:string;


    constructor(amount:number,date:string){
        this.amount=amount;
        this.date=date;
    }


}