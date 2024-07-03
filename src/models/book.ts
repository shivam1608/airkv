import type { AxiosInstance } from "axios";
import type { BookData, BookSchemaOptions, Record } from "../global/types";

class Book{

    public name : string;
    public description : string;

    private id : string;
    private airbaseId : string;
    private _IO : AxiosInstance;
    private metadata : Book;

    constructor(data : BookData){
        this.name = data.name;
        this.description = data.description;
        this.airbaseId = data.airbaseId;
        this._IO = data._IO;
        this.id = data.id;
        this.metadata = data.metadata;
    }


    async createRecord(key : string , value : string){

        if(await this.checkExist(key)){
            throw new Error("The KEY already exists.");
        }

        const response = await this._IO.post(`/${this.airbaseId}/${this.id}` , {
            fields : {
                KEY : key,
                VALUE : value
            }
        });

        return response.status === 200;
    }

    async getRecord(key : string) : Promise<Record | null>{
        const response = await this._IO.get(`${this.airbaseId}/${this.id}/?filterByFormula=REGEX_MATCH(KEY%2C+%22${key}%22)`);
        const record = response.data.records.filter((v : {fields : Record})=>v["fields"]["KEY"]===key);

        // KEY must be always unique
        if(record.length === 0){
            return null;
        }

        record[0]["fields"].id = record[0]["id"];
        return record.length === 0?null:record[0]["fields"];
    }

    async getAllRecords(){
        let response = await this._IO.get(`/${this.airbaseId}/${this.id}`);
        let offset = response.data.offset;
        const records : Record[] = [];
        
        do{

            records.push(...response.data.records.map((v : {id : string , fields : Record})=>{
                v.fields.id = v.id;
                return v.fields;
            }));

            if(offset){
                response = await this._IO.get(`/${this.airbaseId}/${this.id}?offset${offset}`);
                offset = response.data.offset;
            }

        }while(offset);

        return records;
    }

    async checkExist(key : string){
        return (await this.getRecord(key)) !== null;
    }

    async deleteRecord(key : string){

        const record = await this.getRecord(key);

        if(!record){
            return false;
        }

        const response = await this._IO.delete(`${this.airbaseId}/${this.id}/${record.id}`);

        return response.status === 200;
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