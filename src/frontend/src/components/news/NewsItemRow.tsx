interface NewsItem {
  headline: string;
  preview: string;
}

interface NewsItemRowProps {
  item: NewsItem;
  index: number;
}

export function NewsItemRow({ item, index }: NewsItemRowProps) {
  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
            {item.headline}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {item.preview}
          </p>
        </div>
      </div>
    </div>
  );
}
