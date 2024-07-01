import type { BookType } from "../enums/book_type"

export type BookData = {
    name : string,
    description : string,
    type : BookType,
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