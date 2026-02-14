import { Icon } from "@iconify/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type SummaryTone =
  | "primary"
  | "secondary"
  | "accent"
  | "warning"
  | "success"
  | "info"
  | "destructive";

interface SummaryItem {
  key: string;
  title: string;
  value: number | string;
  unit?: string;
  icon: string;
  tone: SummaryTone;
}

interface StatusSummaryCarouselProps {
  items: SummaryItem[];
}

const toneStyles: Record<SummaryTone, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/15", text: "text-primary" },
  secondary: { bg: "bg-secondary", text: "text-secondary-foreground" },
  accent: { bg: "bg-accent", text: "text-accent-foreground" },
  warning: { bg: "bg-warning", text: "text-warning-foreground" },
  success: { bg: "bg-success", text: "text-success-foreground" },
  info: { bg: "bg-info", text: "text-info-foreground" },
  destructive: { bg: "bg-destructive", text: "text-destructive-foreground" },
};

const StatusSummaryCarousel: React.FC<StatusSummaryCarouselProps> = ({
  items,
}) => {
  if (items.length === 0) return null;

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-3">
        {items.map((item) => {
          const styles = toneStyles[item.tone];

          return (
            <CarouselItem key={item.key} className="pl-3 basis-1/2">
              <div className="w-full border rounded-lg p-3 h-full">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${styles.bg}`}
                  >
                    <Icon
                      icon={item.icon}
                      width={16}
                      height={16}
                      className={styles.text}
                    />
                  </div>
                  <h1 className="text-xs font-semibold">{item.title}</h1>
                </div>

                <h1 className="text-2xl font-bold mt-2">{item.value}</h1>

                {item.unit && (
                  <p className="text-[10px] text-muted-foreground">
                    {item.unit}
                  </p>
                )}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default StatusSummaryCarousel;
