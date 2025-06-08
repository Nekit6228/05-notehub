import { useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import  ErrorMessage  from "../ErrorOverlay/ErrorMessage";
import  Loader  from '../LoaderOverlay/Loader'



export default function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [debouncedInputValue] = useDebounce(inputValue, 500);

  const notes = useQuery({
    queryKey: ["notes", debouncedInputValue, currentPage],
    queryFn: () => fetchNotes(debouncedInputValue, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = notes.data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      {notes.isLoading && (
        <div className={css.loaderOverlay}>
          <Loader />
        </div>
      )}

      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={setInputValue} />
        {totalPages > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      <NoteList notes={notes.data?.notes ?? []} />

      {notes.isError && (
        <div className={css.errorOverlay}>
          <ErrorMessage/>
        </div>
      )}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </NoteModal>
      )}
    </div>
  );
}
