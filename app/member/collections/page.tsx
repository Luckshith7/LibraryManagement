"use client";

import React, { useState } from "react";
import { useStore } from "@/app/store/useStore";
import Link from "next/link";
import BookCard from "@/app/(components)/BookCard";
import Modal from "@/app/(components)/Modal";

export default function PersonalCollections() {
  const currentUser = useStore(s => s.currentUser);
  const books = useStore(s => s.books);
  const addCollection = useStore(s => s.addCollection);
  const removeBookFromCollection = useStore(s => s.removeBookFromCollection);

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const collections = currentUser?.collections || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCollection(newName.trim(), newDesc.trim());
    setNewName("");
    setNewDesc("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-10 max-w-6xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-display-sm font-newsreader text-primary mb-2">My Collections</h1>
          <p className="text-body-md font-manrope text-on-surface-variant">
            Curate personal reading lists and organise research materials.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors text-label-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="py-24 text-center bg-surface-container-low rounded-3xl">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-newsreader text-title-lg text-on-surface mb-2">No collections yet</p>
          <p className="font-manrope text-body-md text-on-surface-variant mb-6">Create your first collection to organise your reading.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-primary text-on-primary font-manrope font-bold text-label-md rounded-xl"
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {collections.map(collection => {
            const collectionBooks = books.filter(b => collection.bookIds.includes(b.id));
            return (
              <section key={collection.id} className="bg-surface-container-low rounded-3xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-headline-sm font-newsreader text-primary mb-1">{collection.name}</h2>
                    {collection.description && (
                      <p className="text-body-md font-manrope text-on-surface-variant">{collection.description}</p>
                    )}
                  </div>
                  <span className="text-label-sm font-manrope font-bold text-secondary px-3 py-1 bg-surface rounded-full">
                    {collection.bookIds.length} item{collection.bookIds.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {collectionBooks.length === 0 ? (
                  <div className="border-2 border-dashed border-outline-variant/40 rounded-xl py-10 flex flex-col items-center text-center">
                    <p className="font-manrope text-body-md text-on-surface-variant/60 mb-3">No books in this collection</p>
                    <Link href="/member/catalog" className="text-label-md font-manrope font-bold text-primary hover:underline">
                      Browse catalog to add books →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5" role="list">
                    {collectionBooks.map(book => (
                      <div key={book.id} className="relative group">
                        <BookCard {...book} />
                        <button
                          onClick={() => removeBookFromCollection(collection.id, book.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-error text-on-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Remove from collection"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="New Collection">
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-label-sm font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-2">Collection Name *</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Modernist Studies"
              className="w-full bg-surface-container-low rounded-xl px-5 py-3 outline-none font-manrope text-body-lg text-on-surface focus:shadow-[0_0_0_2px_#012d1d] transition-shadow"
            />
          </div>
          <div>
            <label className="block text-label-sm font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-2">Description</label>
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              rows={3}
              placeholder="Briefly describe this collection..."
              className="w-full bg-surface-container-low rounded-xl px-5 py-3 outline-none font-manrope text-body-lg text-on-surface focus:shadow-[0_0_0_2px_#012d1d] transition-shadow resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsCreating(false)}
              className="flex-1 py-3 bg-surface-container text-on-surface font-manrope font-bold rounded-xl hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors">
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
