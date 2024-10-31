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
    private workspaceId : string;
    private endTotal = -1;
    private logging : boolean;

    constructor(name : string , bases : Base[] , IO : AxiosInstance , workspaceId : string , logging : boolean){
        this.bases = bases;
        this.name = name;
        this.IO = IO;
        this.workspaceId = workspaceId
        this.logging = logging;
    }

    private async createAirbase(name : string) : Promise<Base>{
        const response = await this.IO.post("/meta/bases" , {
            name : name,
            workspaceId : this.workspaceId,
            tables : [{
                name : CONFIG.NAMESPACE,
                description : "Stores the metadata for airkv. Deleting this may break airkv instance",
                fields : [
                    {
                        name: "KEY",
                        type: "singleLineText"
                      },
                      {
                        name: "VALUE",
                        type: "multilineText"
                      },
                ]
            }]
        });
        return {id : response.data.id , name : name};
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

    private async deleteRecord(id : string , baseId : string){;
            const response = await this.IO.delete(`${baseId}/${CONFIG.NAMESPACE}/${id}`);
            return response.status === 200;
    }

    private async isEnd(){

        if(this.endTotal !== -1){
            return this.endTotal >= CONFIG.MAX_RECORDS;
        }
        
        let response = await this.IO.get(`/${this.bases[this.bases.length-1].id}/${CONFIG.NAMESPACE}`)
        let total = response.data.records.length;
        let offset = response.data.offset;
        do {
            if(offset){
                response = await this.IO.get(`/${this.bases[this.bases.length-1].id}/${CONFIG.NAMESPACE}?offset=${offset}`);
                total += response.data.records.length;
                offset = response.data.offset;
            }
        } while (offset);

        this.endTotal = total;
        return total >= CONFIG.MAX_RECORDS;
    }

    private async createOrUpdateRecord(key : string , value : string) {

        if(this.bases.length === 0){
            this.endTotal = -1;
            this.bases.push(await this.createAirbase(this.name));
        }

        if(await this.isEnd()){
            this.endTotal = -1;
            this.bases.push(await this.createAirbase(this.name));
        }

        const record = await this.getRecord(key);
        if(record===null){
            const response = await this.IO.post(`/${this.bases[this.bases.length-1].id}/${CONFIG.NAMESPACE}` , {
                fields : {
                    KEY : key,
                    VALUE : value
                }
            });
            this.endTotal+=1;
            
            if(this.logging){
                console.log("CREATED NEW RECORD = ", response.data , "\n");
            }

            return response.status === 200;
        }

        const response = await this.IO.patch(`${record.base.id}/${CONFIG.NAMESPACE}/${record.id}` , {
            fields : {
                KEY : key,
                VALUE : value
            }
        });

        if(this.logging){
            console.log("UPDATED OLD RECORD = ", response.data , "\n");
        }

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

    async delete(key : string){
        const record = await this.getRecord(key);
        if(record===null){
            return false;
        }
        // TODO => add handler to effectively manage free space created due to deletions
        return this.deleteRecord(record.id , record.base.id);
    }

}


export {
    Airbase
}