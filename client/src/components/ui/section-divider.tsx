import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  imageUrl: string;
}

export function SectionDivider({ className, imageUrl }: SectionDividerProps) {
  return (
    <div className={cn("w-full h-32 bg-cover bg-center", className)} style={{
      backgroundImage: `url(${imageUrl})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% auto"
    }} />
  );
}
