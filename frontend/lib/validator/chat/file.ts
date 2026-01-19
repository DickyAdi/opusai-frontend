import { ALLOWED_MIME_CHAT_UPLOAD_FILE, MAX_FILE_UPLOAD_SIZE } from "@/lib/config/constants";
import {z} from "zod";


export const chat_file_schema = z.instanceof(File)
.refine((file) => file.size <= MAX_FILE_UPLOAD_SIZE, ("Max file size " + MAX_FILE_UPLOAD_SIZE + "MB"))
.refine((file) => ALLOWED_MIME_CHAT_UPLOAD_FILE.includes(file.type), "Only PDF, doc, docx, or txt files allowed")