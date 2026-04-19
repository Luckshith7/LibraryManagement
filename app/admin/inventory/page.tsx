"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useStore, Book, BookStatus } from "@/app/store/useStore";
import Modal from "@/app/(components)/Modal";

const STATUS_COLORS: Record<BookStatus, string> = {
  Available: 'bg-secondary-container text-on-secondary-container',
  Borrowed: 'bg-surface-container-high text-on-surface-variant',
  Reserved: 'bg-primary-container/30 text-primary',
  Missing: 'bg-error-container text-on-error-container',
};

const STATUSES: BookStatus[] = ['Available', 'Borrowed', 'Reserved', 'Missing'];

const EMPTY_BOOK: Omit<Book, 'id'> = {
  title: '', author: '', year: new Date().getFullYear(), isbn: '',
  publisher: '', pages: 0, tags: [], status: 'Available' as BookStatus,
  synopsis: '', callNumber: '', coverImage: '',
};

export default function AdminInventory() {
  const books = useStore(s => s.books);
  const addBook = useStore(s => s.addBook);
  const updateBook = useStore(s => s.updateBook);
  const deleteBook = useStore(s => s.deleteBook);

  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState({ ...EMPTY_BOOK });
  const [tagsInput, setTagsInput] = useState("");

  const filtered = useMemo(() => {
    if (!query) return books;
    const q = query.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.callNumber.toLowerCase().includes(q)
    );
  }, [books, query]);

  const stats = {
    total: books.length,
    available: books.filter(b => b.status === 'Available').length,
    borrowed: books.filter(b => b.status === 'Borrowed').length,
    reserved: books.filter(b => b.status === 'Reserved').length,
  };

  const openAdd = () => { setForm({ ...EMPTY_BOOK }); setTagsInput(""); setIsAdding(true); };
  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({ ...book });
    setTagsInput(book.tags.join(', '));
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (editingBook) {
      updateBook(editingBook.id, { ...form, tags });
    } else {
      addBook({ ...form, tags });
    }
    setIsAdding(false);
    setEditingBook(null);
    setForm({ ...EMPTY_BOOK });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (id: string, status: BookStatus) => {
    updateBook(id, { status });
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-display-sm font-newsreader text-primary mb-1">Inventory Management</h1>
          <p className="text-body-md font-manrope text-on-surface-variant">
            {stats.total} volumes catalogued
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors text-label-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Volume
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-surface-container-low' },
          { label: 'Available', value: stats.available, color: 'bg-secondary-container/50' },
          { label: 'Borrowed', value: stats.borrowed, color: 'bg-surface-container' },
          { label: 'Reserved', value: stats.reserved, color: 'bg-primary-container/20' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <p className="text-display-xs font-newsreader text-primary">{s.value}</p>
            <p className="text-label-md font-manrope text-on-surface-variant mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-surface-container rounded-2xl px-6 py-3.5 flex items-center gap-4 focus-within:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] transition-shadow">
        <svg className="h-5 w-5 text-on-surface-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, author, or call number..."
          className="bg-transparent border-none outline-none flex-1 text-body-md font-manrope text-on-surface placeholder:text-on-surface-variant/50"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container">
          <div className="col-span-1 text-label-sm font-manrope font-bold text-on-surface-variant uppercase tracking-wider">#</div>
          <div className="col-span-4 text-label-sm font-manrope font-bold text-on-surface-variant uppercase tracking-wider">Title</div>
          <div className="col-span-2 text-label-sm font-manrope font-bold text-on-surface-variant uppercase tracking-wider">Author</div>
          <div className="col-span-2 text-label-sm font-manrope font-bold text-on-surface-variant uppercase tracking-wider">Call No.</div>
          <div className="col-span-2 text-label-sm font-manrope font-bold text-on-surface-variant uppercase tracking-wider">Status</div>
          <div className="col-span-1 text-label-sm font-manrope font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-newsreader text-title-lg text-on-surface-variant">No matching records</p>
          </div>
        ) : (
          filtered.map((book, idx) => (
            <div key={book.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-surface-container transition-colors ${idx % 2 === 0 ? '' : 'bg-surface'}`}>
              <div className="col-span-1 text-label-sm font-manrope text-on-surface-variant">
                #{String(idx + 1).padStart(3, '0')}
              </div>
              <div className="col-span-4">
                <p className="font-newsreader text-body-lg text-on-surface truncate">{book.title}</p>
                <p className="font-manrope text-label-sm text-on-surface-variant">{book.year}</p>
              </div>
              <div className="col-span-2 font-manrope text-body-sm text-on-surface-variant truncate">{book.author}</div>
              <div className="col-span-2 font-manrope text-label-sm text-on-surface-variant">{book.callNumber}</div>
              <div className="col-span-2">
                <select
                  value={book.status}
                  onChange={e => handleStatusChange(book.id, e.target.value as BookStatus)}
                  className={`text-label-sm font-manrope font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer appearance-none ${STATUS_COLORS[book.status]}`}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(book)}
                  className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAdding}
        onClose={() => { setIsAdding(false); setEditingBook(null); }}
        title={editingBook ? `Edit: ${editingBook.title}` : "Add New Volume"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Upload Plate */}
          <div className="space-y-2">
            <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest pl-1">Book Cover</label>
            <div className="flex gap-4 items-center">
              <div className="w-24 aspect-[2/3] bg-surface-container rounded-xl overflow-hidden border border-outline-variant/30 flex items-center justify-center flex-shrink-0">
                {form.coverImage ? (
                  <Image src={form.coverImage} alt="Preview" fill sizes="(max-width: 768px) 100vw, 96px" className="object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-on-surface-variant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="inline-block px-4 py-2 bg-surface-container-high text-on-surface font-manrope text-label-md font-bold rounded-lg border border-outline-variant/50 cursor-pointer hover:bg-surface-container-highest transition-colors"
                >
                  {form.coverImage ? 'Replace Image' : 'Choose Cover Image'}
                </label>
                {form.coverImage && (
                  <button 
                    type="button" 
                    onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                    className="ml-3 text-label-sm font-manrope text-error hover:underline"
                  >
                    Remove
                  </button>
                )}
                <p className="text-label-xs font-manrope text-on-surface-variant mt-2">Recommended: 2:3 ratio, portrait orientation.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Author *</label>
              <input required value={form.author} onChange={e => setForm(f => ({...f, author: e.target.value}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Year</label>
              <input type="number" value={form.year} onChange={e => setForm(f => ({...f, year: +e.target.value}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Publisher</label>
              <input value={form.publisher} onChange={e => setForm(f => ({...f, publisher: e.target.value}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Call Number</label>
              <input value={form.callNumber} onChange={e => setForm(f => ({...f, callNumber: e.target.value}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as BookStatus}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all appearance-none">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Tags (comma separated)</label>
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Architecture, Design, History..."
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-label-xs font-manrope font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Synopsis</label>
              <textarea rows={3} value={form.synopsis} onChange={e => setForm(f => ({...f, synopsis: e.target.value}))}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 outline-none font-manrope text-body-md focus:shadow-[0_0_0_2px_rgba(27,67,50,0.2)] border border-outline-variant/30 focus:border-primary transition-all resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setEditingBook(null); }}
              className="flex-1 py-3 bg-surface-container text-on-surface font-manrope font-bold rounded-xl hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors">
              {editingBook ? 'Save Changes' : 'Add Volume'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
