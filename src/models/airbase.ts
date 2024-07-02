import type { AirbaseSchema } from "../global/types";
import { Book } from "./book";

class Airbase {
    
    public id : string;
    public name : string;
    public _extended : boolean;

    public books : Book[];

    constructor({id , name , books , _extended} : AirbaseSchema){
        this.id = id;
        this.name = name;
        this.books = [];
        for(let i=0;i<books.length;i++){
            this.books.push(new Book(books[i]));
        }
        this._extended = _extended;
    }
}

export {
    Airbase
}