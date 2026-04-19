import Image from "next/image";
import Link from "next/link";
import { BookStatus } from "@/app/store/useStore";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  year?: number;
  status: BookStatus;
  coverImage?: string;
}

export default function BookCard({ id, title, author, year, status, coverImage }: BookCardProps) {
  const statusConfig: Record<BookStatus, { label: string; className: string }> = {
    Available: { label: 'Available', className: 'bg-secondary-container text-on-secondary-container' },
    Borrowed: { label: 'Borrowed', className: 'bg-surface-container-highest text-on-surface-variant' },
    Reserved: { label: 'Reserved', className: 'bg-primary-container/30 text-primary' },
    Missing: { label: 'Missing', className: 'bg-error-container text-on-error-container' },
  };

  const { label, className: statusClass } = statusConfig[status] || statusConfig['Borrowed'];

  // Generate a deterministic subtle hue for the cover based on title
  const hues = ['from-emerald-900/80 to-emerald-700/60', 'from-stone-700/80 to-stone-600/60', 'from-teal-900/80 to-teal-700/60', 'from-slate-800/80 to-slate-600/60'];
  const coverHue = hues[title.charCodeAt(0) % hues.length];

  return (
    <Link href={`/member/book/${id}`} className="group block h-full">
      <div className="h-full bg-surface-container-lowest rounded-[1.5rem] overflow-hidden transition-soft soft-ui-shadow hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 border border-outline-variant/10 group-hover:border-primary/20">
        {/* Cover */}
        <div className={`w-full aspect-[2/3] bg-gradient-to-br ${coverHue} relative overflow-hidden`}>
          {coverImage ? (
            <Image 
              src={coverImage} 
              alt={title} 
              fill
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
              <p className="font-newsreader text-white/90 text-body-md leading-snug line-clamp-4 group-hover:text-white transition-colors">
                {title}
              </p>
            </div>
          )}
          {/* Status badge overlaid on cover */}
          <span className={`absolute top-3 right-3 text-label-xs font-manrope font-bold px-2.5 py-1 rounded-full ${statusClass}`}>
            {label}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-newsreader text-body-lg text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {title}
          </h3>
          <p className="font-manrope text-label-md text-on-surface-variant">{author}</p>
          {year && <p className="font-manrope text-label-xs text-on-surface-variant/60 mt-0.5">{year}</p>}
        </div>
      </div>
    </Link>
  );
}
