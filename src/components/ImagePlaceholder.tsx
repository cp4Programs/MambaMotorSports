type Props = {
  label: string;
  className?: string;
};

export function ImagePlaceholder({ label, className = "" }: Props) {
  return (
    <div
      className={`flex items-center justify-center rounded-[14px] border border-dashed border-[oklch(34%_0.02_255)] bg-[oklch(27%_0.02_255_/_0.6)] text-center text-sm text-[oklch(60%_0.01_260)] ${className}`}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}
