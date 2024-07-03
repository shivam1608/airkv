import type { AirbaseSchema } from "../global/types";
import { Book } from "./book";

class Airbase {
    
    public id : string;
    public name : string;
    private metadata : Book|null =null;

    public books : Book[];

    constructor({id , name , books} : AirbaseSchema){
        this.id = id;
        this.name = name;
        this.books = [];
        for(let i=0;i<books.length;i++){
            const book = new Book(books[i]);
            if(book.name === "_airkv"){
                this.metadata = book;
            }else{
                this.books.push(book);
            }
        }
    }


    async setExtended(extended : boolean){

        if(!this.metadata){
            throw new Error("Metadata is missing from database.")
        }

        const exists = await this.metadata.checkExist("extended");
        if(extended){
            if(!exists){
                const done = await this.metadata.createRecord("extended" , "true");
                return done;
            }
        }else{
            if(exists){
                const done = await this.metadata.deleteRecord("extended");
                return done;
            }
        }
    }



    
}

export {
    Airbase
}