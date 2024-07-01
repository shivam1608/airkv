import axios from "axios";
import { CONFIG } from "../config";

const IOAdapter = (token : string) => {
    const io = axios.create({
        baseURL : CONFIG.BASE_URL
    });
    
    io.interceptors.request.use((config)=>{
        
        config.headers["Content-Type"] = "application/json";
        config.headers.Authorization = `Bearer ${token}`;

        return config;
    } , (err)=>Promise.reject(err));

    return io;
}


export {IOAdapter};