import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { listSiteImageSlots } from "@/server/repo";

type Props = {
  slot: string;
  label: string;
  className?: string;
};

export async function SitePhoto({ slot, label, className = "" }: Props) {
  const slots = await listSiteImageSlots();
  if (!slots.includes(slot)) {
    return <ImagePlaceholder label={label} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/media/${encodeURIComponent(slot)}`}
      alt={label}
      className={`rounded-[14px] object-cover ${className}`}
    />
  );
}
