import type { AxiosInstance } from "axios";
import type { AirKVOptions } from "./global/types";
import { IOAdapter } from "./io/io";
import { Airbase } from "./models/airbase";

class AirKV {
    private token : string;
    private workspaceId : string;
    private IO : AxiosInstance;

    constructor(options : AirKVOptions){
        this.token = options.token;
        this.workspaceId = options.workspaceId;
        this.IO = IOAdapter(this.token);
    }

    async findAirbase(name : string){
        let response = await this.IO.get("/meta/bases");

        let offset = response.data.offset;
        const bases : {name : string , id : string}[] = [];
        
        do{

            bases.push(...response.data.bases.filter((v : {name : string , id : string})=>{
                return v.name === name;
            }));

            if(offset){
                response = await this.IO.get(`/meta/bases?offset${offset}`);
                offset = response.data.offset;
            }

        }while(offset);

        if(bases.length === 0){
            return null;
        }

        return new Airbase(bases[0].name , bases , this.IO);
    }

}


export {
    AirKV
}
