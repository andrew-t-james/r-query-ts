import React, { useState } from "react";
import AddBooksPresenter from "./AddBookPresenter";

export default function AddBooksComponent() {
  let addBooksPresenter = new AddBooksPresenter();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");

  function handleAddbook() {
    addBooksPresenter.addBook(name, author);
    setName("");
    setAuthor("");
  }

  return (
    <div>
      <h5>Add Book (api)</h5>
      name : <br />{" "}
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <br /> author : <br />{" "}
      <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      <br />
      <button onClick={handleAddbook}>add book</button>
    </div>
  );
}
