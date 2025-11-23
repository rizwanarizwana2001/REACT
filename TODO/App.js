import React, { useEffect, useState } from "react";
import "./App.css"

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos_v1", JSON.stringify(todos));
  }, [todos]);

  function resetForm() {
    setTitle("");
    setDesc("");
    setDate("");
    setTime("");
    setEditingId(null);
  }

  function handleAddOrUpdate(e) {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for the todo.");
      return;
    }

    const dateTime = date && time ? new Date(`${date}T${time}`) : null;

    if (editingId) {
      setTodos((prev) =>
        prev.map((t) =>
          String(t.id) === String(editingId)
            ? {
                ...t,
                title: title.trim(),
                desc: desc.trim(),
                date: date || null,
                time: time || null,
                datetime: dateTime ? dateTime.toISOString() : null,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
    } else {
      const newTodo = {
        id: Date.now().toString(),
        title: title.trim(),
        desc: desc.trim(),
        date: date || null,
        time: time || null,
        datetime: dateTime ? dateTime.toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setTodos((prev) => [newTodo, ...prev]);
    }

    resetForm();
  }

  function handleEdit(todo) {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDesc(todo.desc || "");
    setDate(todo.date || "");
    setTime(todo.time || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    console.log("Delete clicked for id:", id);
    // use window.confirm explicitly
    if (!window.confirm("Delete this todo?")) return;
    setTodos((prev) => prev.filter((t) => String(t.id) !== String(id)));
  }

  function formatDateTime(isoString) {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleString();
    } catch (e) {
      return isoString;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Todo App — add / edit / delete</h1>
          <p className="text-sm text-gray-600">Includes date and time for each todo. Saved to localStorage.</p>
        </header>

        <form
          onSubmit={handleAddOrUpdate}
          className="bg-white p-4 rounded-2xl shadow-sm mb-6"
          aria-label="todo-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="Buy milk, Walk dog..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                aria-label="todo-date"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                rows={3}
                placeholder="Details about the task..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                aria-label="todo-time"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-sm"
              >
                {editingId ? "Update Todo" : "Add Todo"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-2 rounded-xl bg-gray-200 text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        <section>
          <h2 className="text-lg font-semibold mb-3">Your Todos ({todos.length})</h2>

          {todos.length === 0 ? (
            <div className="text-gray-600">No todos yet — add one above!</div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li key={todo.id} className="bg-white p-3 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{todo.title}</h3>
                      <div className="text-xs text-gray-500">{todo.date || todo.time ? "(scheduled)" : "(unscheduled)"}</div>
                    </div>

                    {todo.desc && <p className="text-sm text-gray-700 mt-1">{todo.desc}</p>}

                    <div className="mt-2 text-xs text-gray-500">
                      <div>Created: {formatDateTime(todo.createdAt)}</div>
                      <div>When: {todo.datetime ? formatDateTime(todo.datetime) : "No date/time set"}</div>
                      {todo.updatedAt && <div>Updated: {formatDateTime(todo.updatedAt)}</div>}
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 md:ml-4 flex-shrink-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(todo)}
                      className="px-3 py-1 rounded-xl border border-gray-300 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(todo.id)}
                      className="px-3 py-1 rounded-xl border border-red-300 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-6 text-xs text-gray-500">Tip: use the date and time fields to schedule reminders — they are stored in ISO format for easy comparison/sorting later.</footer>
      </div>
    </div>
  );
}


