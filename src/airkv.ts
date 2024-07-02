import type { AxiosInstance } from "axios";
import { IOAdapter } from "./io/io";
import type { BookSchema } from "./global/types";
import { Airbase } from "./models/airbase";

type Options = {
    token : string,
    workspaceId : string,
    extendDB? : boolean
}


class AirKV {

    private token : string;
    private workspaceId : string;
    private IO : AxiosInstance;
    private extendDB : boolean;


    constructor(options : Options){
       this.token = options.token;
       this.workspaceId = options.workspaceId;
       this.IO = IOAdapter(this.token);

       this.extendDB = options.extendDB?true:false;

    }


    async createAirbase(name : string , bookSchema : BookSchema ){
        const response = await this.IO.post("/meta/bases" , {
            name : name,
            workspaceId : this.workspaceId,
            tables : [...bookSchema]
        });

        response.data.books = response.data.tables;
        response.data._extended = this.extendDB;
        return new Airbase(response.data);
    }

    async findAirbase(name : string){
        let response = await this.IO.get("/meta/bases");
        let offset = response.data.offset;
        const bases = [];
        
        do{

            bases.push(...response.data.bases.filter((v : {name : string})=>{
                let id : string = v.name;
                if(id.includes("#")){
                    id = id.substring(0 , id.indexOf("#"));
                }

                return id === name;
            }));

            if(offset){
                response = await this.IO.get(`/meta/bases?offset${offset}`);
                offset = response.data.offset;
            }

        }while(offset);

        const airbases : Airbase[] = [];

        for(let i=0;i<bases.length;i++){
            const response = await this.IO.get(`/meta/bases/${bases[i].id}/tables`);
    
            response.data.id = bases[i].id;
            response.data.name = bases[i].name;
            response.data.books = response.data.tables;
            response.data._extended = this.extendDB;

            airbases.push(new Airbase(response.data));
        }

        return airbases;
    }



}

export {AirKV};