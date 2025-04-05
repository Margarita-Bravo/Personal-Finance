export class Gasto{

    id!: number;
    name?: string;                 
    amount?:number;                   
    method_of_payment?:string;  
    date?:string;

    constructor(name:string,amount:number,method_of_payment:string,date:string){
        this.name=name;
        this.amount=amount;
        this.method_of_payment=method_of_payment;
        this.date=date;
    }
}