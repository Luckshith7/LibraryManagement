"use client";

import React from "react";
import { useStore } from "@/app/store/useStore";

export default function ToastManager() {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => {
        const bgColors = {
          success: "bg-primary text-on-primary",
          error: "bg-error text-on-error",
          info: "bg-secondary-container text-on-secondary-container"
        };
        
        return (
          <div 
            key={toast.id}
            className={`min-w-[300px] px-6 py-4 rounded-xl shadow-[0_8px_32px_rgba(26,28,26,0.12)] flex items-center justify-between pointer-events-auto transform transition-all animate-in fade-in slide-in-from-bottom-5 ${bgColors[toast.type]}`}
          >
            <p className="font-manrope text-label-md font-bold">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="opacity-70 hover:opacity-100 transition-opacity ml-4 outline-none"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
