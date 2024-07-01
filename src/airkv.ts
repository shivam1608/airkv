type Options = {
    token : string,
    workspaceId : string
}

class AirKV {

    private token : string;
    private workspaceId : string;


    constructor(options : Options){
       this.token = options.token;
       this.workspaceId = options.workspaceId;
    }


    



}

export {AirKV};