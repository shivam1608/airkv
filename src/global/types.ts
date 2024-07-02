import type { AxiosInstance } from "axios"
import type { BookType } from "../enums/book_type"
import type { Airbase } from "../models/airbase"

export type BookData = {
    id : string,
    name : string,
    description : string,
    type : BookType,
    airbaseId : string,
    _IO : AxiosInstance
}

export type Record = {
    id : string,
    KEY : string,
    VALUE : string
}

export type BookSchemaOptions = {
    books : BookData[]
}

export type BookSchema = {
    name: string;
    description: string;
    fields: {
        name: string;
        description: string;
        type: string;
    }[];
}[];


export type AirbaseSchema = {
    name : string,
    id : string,
    books : BookData[],
    _extended : boolean,
    _next : Airbase,
}