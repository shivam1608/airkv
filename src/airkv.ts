import type { AxiosInstance } from "axios";
import { IOAdapter } from "./io/io";
import type { BookSchema, BookSchemaOptions } from "./global/types";
import { Book } from "./models/book";

type Options = {
    token : string,
    workspaceId : string
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
            tables : [...bookSchema]
        });

        return response.data;
    }



}

export {AirKV};