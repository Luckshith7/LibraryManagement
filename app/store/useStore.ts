import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BookStatus = 'Available' | 'Borrowed' | 'Reserved' | 'Missing';
export type UserRole = 'Admin' | 'Member';
export type MemberStatus = 'Active' | 'Suspended';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  isbn: string;
  publisher: string;
  pages: number;
  tags: string[];
  status: BookStatus;
  synopsis: string;
  callNumber: string;
  coverImage?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: string;
  status: MemberStatus;
  joined: string;
  borrowedBooks: string[];  // book ids
  reservations: string[];   // reservation ids
  collections: Collection[];
}

export interface Reservation {
  id: string;
  userId: string;
  date: string;
  time: string;
  materials: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  bookIds: string[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthLoading: boolean;
  setIsAuthLoading: (loading: boolean) => void;
  logout: () => void;

  // Books / Inventory
  books: Book[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setBooks: (books: Book[]) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  borrowBook: (bookId: string) => void;
  returnBook: (bookId: string) => void;
  reserveBook: (bookId: string) => void;

  // Members
  members: User[];
  addMember: (member: Omit<User, 'id' | 'borrowedBooks' | 'reservations' | 'collections'>) => void;
  updateMemberStatus: (id: string, status: MemberStatus) => void;

  // Reservations
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id' | 'userId' | 'createdAt'>) => void;
  cancelReservation: (id: string) => void;

  // Collections
  addCollection: (name: string, description: string) => void;
  addBookToCollection: (collectionId: string, bookId: string) => void;
  removeBookFromCollection: (collectionId: string, bookId: string) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Global User Sync
  setUser: (user: User | null) => void;

  // System Logs
  logs: SystemLog[];
  addLog: (action: string, details: string) => void;
}

const INITIAL_BOOKS: Book[] = [
  {
    id: '1', title: 'The Architecture of the City', author: 'Aldo Rossi',
    year: 1966, isbn: '978-0262680431', publisher: 'MIT Press', pages: 204,
    tags: ['Architecture', 'History'], status: 'Available',
    callNumber: 'NA2760 .R6713',
    synopsis: 'A seminal text in architectural theory, Rossi explores the relationship between urban form and collective memory. Drawing on typological analysis, he argues that cities are complex artifacts shaped by time, culture, and human experience.'
  },
  {
    id: '2', title: 'The Design of Everyday Things', author: 'Don Norman',
    year: 1988, isbn: '978-0465050659', publisher: 'Basic Books', pages: 368,
    tags: ['Design', 'Psychology'], status: 'Borrowed',
    callNumber: 'TS171 .N67',
    synopsis: 'Norman unravels the principles behind intuitive design, revealing how poor design leads to user frustration while good design empowers users through clear signifiers and affordances.'
  },
  {
    id: '3', title: 'Interaction of Color', author: 'Josef Albers',
    year: 1963, isbn: '978-0300179354', publisher: 'Yale University Press', pages: 197,
    tags: ['Design', 'Art'], status: 'Available',
    callNumber: 'ND1488 .A4',
    synopsis: 'Josef Albers presents the groundbreaking insight that color is always in relation — its appearance fundamentally shifts depending on its context and adjacent hues.'
  },
  {
    id: '4', title: 'Grid Systems in Graphic Design', author: 'Josef Müller-Brockmann',
    year: 1981, isbn: '978-3721201451', publisher: 'Niggli', pages: 176,
    tags: ['Typography', 'Design'], status: 'Reserved',
    callNumber: 'Z246 .M85',
    synopsis: 'The definitive manual on the Swiss grid system, outlining a mathematical, objective approach to visual design that has influenced generations of graphic designers.'
  },
  {
    id: '5', title: 'The Ten Books on Architecture', author: 'Vitruvius Pollio',
    year: 15, isbn: '978-0486206455', publisher: 'Dover Publications', pages: 331,
    tags: ['Architecture', 'History', 'Classical'], status: 'Available',
    callNumber: 'NA2515 .V7',
    synopsis: 'The only surviving major work on architecture from classical antiquity. Vitruvius established the triad of Firmitas, Utilitas, and Venustas (Strength, Utility, and Beauty).'
  },
  {
    id: '6', title: 'The Elements of Typographic Style', author: 'Robert Bringhurst',
    year: 1992, isbn: '978-0881792126', publisher: 'Hartley & Marks', pages: 352,
    tags: ['Typography', 'Design'], status: 'Available',
    callNumber: 'Z246 .B74',
    synopsis: 'Regarded as the "typographer\'s bible," Bringhurst merges the history of typography with practical, precise instructions for high-quality book design and composition.'
  },
  {
    id: '7', title: 'Ways of Seeing', author: 'John Berger',
    year: 1972, isbn: '978-0140135152', publisher: 'Penguin Books', pages: 176,
    tags: ['Art', 'Philosophy', 'Sociology'], status: 'Available',
    callNumber: 'N71 .B38',
    synopsis: 'Based on the BBC television series, Berger\'s work challenges traditional ways of looking at art, revealing the underlying ideologies and social constructs in visual culture.'
  },
  {
    id: '8', title: 'The Death and Life of Great American Cities', author: 'Jane Jacobs',
    year: 1961, isbn: '978-0679741954', publisher: 'Random House', pages: 458,
    tags: ['Urbanism', 'Sociology'], status: 'Borrowed',
    callNumber: 'HT167 .J32',
    synopsis: 'A critique of 1950s urban planning policy, which it holds responsible for the decline of many city neighborhoods in the United States. Jacobs celebrates the "ballet of the sidewalk."'
  },
  {
    id: '9', title: 'The Archaeology of Knowledge', author: 'Michel Foucault',
    year: 1969, isbn: '978-0415287531', publisher: 'Routledge', pages: 256,
    tags: ['Philosophy', 'History', 'Language'], status: 'Available',
    callNumber: 'AZ101 .F6813',
    synopsis: 'Foucault outlines a methodology for examining the history of systems of thought, or "discursive formations," rather than focusing on individual authors or linear progress.'
  },
  {
    id: '10', title: 'Design, Form, and Chaos', author: 'Paul Rand',
    year: 1993, isbn: '978-0300055351', publisher: 'Yale University Press', pages: 232,
    tags: ['Design', 'Art'], status: 'Available',
    callNumber: 'NK1510 .R3',
    synopsis: 'One of the world\'s leading graphic designers discusses the state of his craft and shares his thoughts on the relationship between art and commercials.'
  },
  {
    id: '11', title: 'To Engineer Is Human', author: 'Henry Petroski',
    year: 1985, isbn: '978-0679734161', publisher: 'Vintage', pages: 256,
    tags: ['Engineering', 'Psychology'], status: 'Available',
    callNumber: 'TA174 .P47',
    synopsis: 'Petroski explores the role of failure in successful design, arguing that understanding why things break is fundamental to creating stronger and more reliable structures.'
  },
  {
    id: '12', title: 'The Distant Mirror', author: 'Barbara Tuchman',
    year: 1978, isbn: '978-0345349576', publisher: 'Ballantine Books', pages: 677,
    tags: ['History', 'Medieval'], status: 'Reserved',
    callNumber: 'D117 .T8',
    synopsis: 'A masterful narrative history of the calamitous 14th century, examining the parallels between the turmoil of the Middle Ages and the challenges of the modern era.'
  }
];

const INITIAL_MEMBERS: User[] = [
  {
    id: 'SYS-AD-001', name: 'Dr. Alistair Vance', email: 'vance@lexicon.org',
    role: 'Admin', tier: 'Senior Curator', status: 'Active', joined: '2018',
    borrowedBooks: [], reservations: [], collections: []
  },
  {
    id: 'SCH-RES-042', name: 'Julian Thorne', email: 'j.thorne@academy.edu',
    role: 'Member', tier: 'Research Scholar', status: 'Active', joined: '2022',
    borrowedBooks: ['2', '8'], reservations: [], collections: []
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // AUTH
      currentUser: null,
      isAuthLoading: true,
      setIsAuthLoading: (loading) => set({ isAuthLoading: loading }),
      logout: () => {
        const user = get().currentUser;
        if (user) get().addLog('Logout', `${user.name} logged out.`);
        set({ currentUser: null });
        get().addToast('You have been safely logged out.', 'info');
      },

      // BOOKS
      books: INITIAL_BOOKS,
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      setBooks: (books) => set({ books }),
      addBook: (book) => {
        const newBook: Book = { ...book, id: Date.now().toString() };
        set((state) => ({ books: [...state.books, newBook] }));
        get().addToast(`"${book.title}" added to the catalog.`, 'success');
        get().addLog('Inventory Update', `New book added: ${book.title}`);
      },
      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
        get().addToast('Book record updated.', 'success');
        get().addLog('Inventory Update', `Book record ${id} modified.`);
      },
      deleteBook: (id) => {
        const book = get().books.find(b => b.id === id);
        set((state) => ({ books: state.books.filter(b => b.id !== id) }));
        get().addToast(`"${book?.title}" removed from catalog.`, 'info');
        get().addLog('Inventory Update', `Book removed: ${book?.title}`);
      },
      borrowBook: (bookId) => {
        const user = get().currentUser;
        if (!user) return;
        const book = get().books.find(b => b.id === bookId);
        if (!book || book.status !== 'Available') {
          get().addToast('This book is not available for borrowing.', 'error');
          return;
        }
        set((state) => ({
          books: state.books.map(b => b.id === bookId ? { ...b, status: 'Borrowed' as BookStatus } : b),
          members: state.members.map(m => m.id === user.id
            ? { ...m, borrowedBooks: [...m.borrowedBooks, bookId] }
            : m
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, borrowedBooks: [...(state.currentUser.borrowedBooks || []), bookId] }
            : state.currentUser
        }));
        get().addToast(`You have borrowed "${book.title}".`, 'success');
        get().addLog('Circulation', `${user.name} borrowed ${book.title}`);
      },
      returnBook: (bookId) => {
        const user = get().currentUser;
        if (!user) return;
        const book = get().books.find(b => b.id === bookId);
        set((state) => ({
          books: state.books.map(b => b.id === bookId ? { ...b, status: 'Available' as BookStatus } : b),
          members: state.members.map(m => m.id === user.id
            ? { ...m, borrowedBooks: m.borrowedBooks.filter(id => id !== bookId) }
            : m
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, borrowedBooks: (state.currentUser.borrowedBooks || []).filter(id => id !== bookId) }
            : state.currentUser
        }));
        get().addToast(`"${book?.title}" returned successfully.`, 'success');
        get().addLog('Circulation', `${user.name} returned ${book?.title}`);
      },
      reserveBook: (bookId) => {
        const user = get().currentUser;
        if (!user) return;
        const book = get().books.find(b => b.id === bookId);
        if (!book) return;
        set((state) => ({
          books: state.books.map(b => b.id === bookId ? { ...b, status: 'Reserved' as BookStatus } : b),
        }));
        get().addToast(`"${book.title}" reserved for Reading Room.`, 'success');
        get().addLog('Reservation', `${user.name} reserved ${book.title}`);
      },

      // MEMBERS
      members: INITIAL_MEMBERS,
      addMember: (member) => {
        const id = `M-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        const newMember: User = { ...member, id, borrowedBooks: [], reservations: [], collections: [] };
        set((state) => ({ members: [...state.members, newMember] }));
        get().addToast(`Curator credentials issued for ${member.name}.`, 'success');
        get().addLog('User Management', `New member registered: ${member.name}`);
      },
      updateMemberStatus: (id, status) => {
        const member = get().members.find(m => m.id === id);
        set((state) => ({
          members: state.members.map(m => m.id === id ? { ...m, status } : m)
        }));
        get().addToast(`Member status updated to ${status}.`, status === 'Active' ? 'success' : 'info');
        get().addLog('User Management', `Member ${member?.name} status set to ${status}`);
      },

      // RESERVATIONS
      reservations: [],
      addReservation: (res) => {
        const user = get().currentUser;
        if (!user) return;
        const newRes: Reservation = {
          ...res,
          id: Date.now().toString(),
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          reservations: [...state.reservations, newRes],
          members: state.members.map(m => m.id === user.id
            ? { ...m, reservations: [...m.reservations, newRes.id] }
            : m
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, reservations: [...(state.currentUser.reservations || []), newRes.id] }
            : state.currentUser
        }));
        get().addToast(`Reading room reserved.`, 'success');
        get().addLog('Reservation', `${user.name} booked a reading room slot.`);
      },
      cancelReservation: (id) => {
        set((state) => ({ reservations: state.reservations.filter(r => r.id !== id) }));
        get().addToast('Reservation cancelled.', 'info');
      },

      // COLLECTIONS
      addCollection: (name, description) => {
        const user = get().currentUser;
        if (!user) return;
        const newColl: Collection = { id: Date.now().toString(), name, description, bookIds: [] };
        set((state) => ({
          members: state.members.map(m => m.id === user.id
            ? { ...m, collections: [...m.collections, newColl] }
            : m
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, collections: [...(state.currentUser.collections || []), newColl] }
            : state.currentUser
        }));
        get().addToast(`Collection "${name}" created.`, 'success');
      },
      addBookToCollection: (collectionId, bookId) => {
        const user = get().currentUser;
        if (!user) return;
        set((state) => ({
          members: state.members.map(m => m.id === user.id
            ? { ...m, collections: m.collections.map(c => c.id === collectionId ? { ...c, bookIds: [...c.bookIds, bookId] } : c) }
            : m
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, collections: (state.currentUser.collections || []).map(c => c.id === collectionId ? { ...c, bookIds: [...c.bookIds, bookId] } : c) }
            : state.currentUser
        }));
        get().addToast('Book added to collection.', 'success');
      },
      removeBookFromCollection: (collectionId, bookId) => {
        const user = get().currentUser;
        if (!user) return;
        set((state) => ({
          members: state.members.map(m => m.id === user.id
            ? { ...m, collections: m.collections.map(c => c.id === collectionId ? { ...c, bookIds: c.bookIds.filter(id => id !== bookId) } : c) }
            : m
          ),
          currentUser: state.currentUser?.id === user.id
            ? { ...state.currentUser, collections: (state.currentUser.collections || []).map(c => c.id === collectionId ? { ...c, bookIds: c.bookIds.filter(id => id !== bookId) } : c) }
            : state.currentUser
        }));
        get().addToast('Book removed from collection.', 'info');
      },

      // TOASTS
      toasts: [],
      addToast: (message, type = 'info') => {
        const id = Date.now().toString();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 4500);
      },
      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
      },

      setUser: (user) => set((state) => {
        if (!user) return { currentUser: null };
        const memberExists = state.members.some(m => m.id === user.id || m.email === user.email);
        if (!memberExists) {
          return { currentUser: user, members: [...state.members, user] };
        }
        return { currentUser: user };
      }),

      // LOGS
      logs: [],
      addLog: (action, details) => {
        const newLog: SystemLog = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          user: get().currentUser?.name || 'System',
          action,
          details
        };
        set((state) => ({ logs: [newLog, ...state.logs].slice(0, 50) })); // Keep last 50
      },
    }),
    {
      name: 'lexicon-archival-system-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
