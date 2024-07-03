import type { AxiosInstance } from "axios";
import { IOAdapter } from "./io/io";
import type { BookSchema } from "./global/types";
import { Airbase } from "./models/airbase";
import { BookType } from "./enums/book_type";

type Options = {
    token : string,
    workspaceId : string,
    extendDB? : boolean
}


class AirKV {

    private token : string;
    private workspaceId : string;
    private IO : AxiosInstance;


    constructor(options : Options){
       this.token = options.token;
       this.workspaceId = options.workspaceId;
       this.IO = IOAdapter(this.token);

    }


    async createAirbase(name : string , bookSchema : BookSchema ){
        const response = await this.IO.post("/meta/bases" , {
            name : name,
            workspaceId : this.workspaceId,
            tables : [...bookSchema , {
                name : "_airbase",
                description : "Stores the metadata for airkv. Deleting this may break airkv instance",
                fields : [
                    {
                        name: "KEY",
                        type: "singleLineText"
                      },
                      {
                        VALUE: "Address",
                        type: BookType.TEXT
                      },
                ]
            }]
        });

        response.data.books = response.data.tables;
        return new Airbase(response.data);
    }

    async findAirbase(name : string){
        let response = await this.IO.get("/meta/bases");
        let offset = response.data.offset;
        const bases : {name : string , id : string}[] = [];
        
        do{

            bases.push(...response.data.bases.filter((v : {name : string , id : string})=>{
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

            const metadata = response.data.tables.filter((v:any)=>v.name === "_airkv")[0];
            response.data.books = response.data.tables.map((v : {name : string , id : string})=>{
                return {...v , 
                    airbaseId : bases[i].id,
                    _IO : this.IO,
                    metadata : metadata || null
                }
            });
            response.data._IO = this.IO;

            airbases.push(new Airbase(response.data));
        }

        return airbases;
    }



}

export {AirKV};