import axios from "axios";
import type { Note } from "../types/note";


const BASE_URL = "https://notehub-public.goit.study/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


// take notes
export async function fetchNotes(
  search = "",
  page = 1
): Promise<FetchNotesResponse> {
  const params: FetchNotesParams = { page, perPage: 10 };
  if (search.trim()) params.search = search.trim();

  const response = await axiosInstance.get<FetchNotesResponse>("/notes", { params });
  return response.data;
}

// create newNote 

export async function createNote(newNote: Partial<Note>): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", newNote);
  return response.data;
}

// delete note 
export async function deleteNote(noteId: number): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
}