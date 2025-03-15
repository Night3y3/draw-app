import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export const client = axios.create({
  baseURL: HTTP_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If you need to send cookies or auth credentials
});
