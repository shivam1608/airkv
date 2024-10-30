import type { AxiosInstance } from "axios";
import { CONFIG } from "../config";

type Base = {
    id : string,
    name : string
}

type Record = {
    createdTime : string,
    fields : {
        KEY : string,
        VALUE : string
    },
    base : Base,
    id : string
}

class Airbase {
    private name : string;
    private bases : Base[];
    private IO : AxiosInstance;

    constructor(name : string , bases : Base[] , IO : AxiosInstance){
        this.bases = bases;
        this.name = name;
        this.IO = IO;
    }

    private async getRecord(key : string) : Promise<Record | null> {
        // Only 1 key can exists at a time
        let record = null;
        for(let base of this.bases){
            const response = await this.IO.get(`/${base.id}/${CONFIG.NAMESPACE}/?filterByFormula=REGEX_MATCH(KEY%2C+%22${key}%22)`);
            const records : Record[] = response.data.records.filter((record : Record) => record.fields.KEY === key);

            if(records.length !== 0){
                record = records[0];
                record.base = base;
                // breaks & retruns value of the first key found.
                break;
            }
        }
        return record;
    }

    private async createOrUpdateRecord(key : string , value : string) {
        const record = await this.getRecord(key);
        if(record===null){
            const response = await this.IO.post(`/${this.bases[this.bases.length-1].id}/${CONFIG.NAMESPACE}` , {
                fields : {
                    KEY : key,
                    VALUE : value
                }
            });
            console.log("CREATED NEW RECORD = ", response.data , "\n");

            return response.status === 200;
        }

        const response = await this.IO.patch(`${record.base.id}/${CONFIG.NAMESPACE}/${record.id}` , {
            fields : {
                KEY : key,
                VALUE : value
            }
        });

        console.log("UPDATED OLD RECORD = ", response.data , "\n");

        return response.status === 200;
    }


    async exists(key : string) : Promise<boolean> {
        return this.get(key)!==null;
    }
    
    async get(key : string) : Promise<string|null>{
        const record = await this.getRecord(key);
        if(record===null){
            return null;
        }
        return record.fields.VALUE;
    }

    async set(key : string , value : string){
        return this.createOrUpdateRecord(key , value);
    }

}


export {
    Airbase
}