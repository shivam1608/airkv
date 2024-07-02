import type { BookData, BookSchemaOptions } from "../global/types";

class Book{

    public name : string;
    public description : string;

    constructor(data : BookData){
        this.name = data.name;
        this.description = data.description;
    }
    
    public static createSchema(options : BookSchemaOptions){
        if(!options.books){
            throw new Error("Books field in option is mandatory");
        }

        const tables = [];
        for(const book of options.books){
            tables.push({
                name : book.name,
                description : book.description,
                fields : [
                    {
                        name : "KEY",
                        description : "Database is being used by AirKV",
                        type : "singleLineText"
                    },
                    {
                        name : "VALUE",
                        description : "Database is being used by AirKV",
                        type : book.type
                    }
                ]
            })
        };

        return tables;
    }
}

export {
    Book
}