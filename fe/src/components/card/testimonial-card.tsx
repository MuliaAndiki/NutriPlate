import Image from "next/image";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  avatar: string;
}

const TestimonialCard = ({
  quote,
  name,
  role,
  avatar,
}: TestimonialCardProps) => {
  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm">
      <CardContent className="flex flex-col gap-4">
        <Icon
          icon="mdi:format-quote-open"
          className="h-7 w-7 text-primary"
        />
        <p className="text-sm leading-relaxed text-foreground/80">“{quote}”</p>
        <div className="h-px w-full bg-border" />
      </CardContent>
      <CardFooter className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{name}</span>
          {role ? (
            <span className="text-xs text-muted-foreground">{role}</span>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
