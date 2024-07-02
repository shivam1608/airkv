import type { Book } from "./book";

class Airbase {
    
    public id : string;
    public name : string;
    public _extended : boolean;

    public books : Book[];

    constructor({id , name , books , _extended} : Airbase){
        this.id = id;
        this.name = name;
        this.books = books;
        this._extended = _extended;
    }

    

}

export {
    Airbase
}