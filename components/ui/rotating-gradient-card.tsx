"use client";

import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/libs/utils";

interface RotatingGradientCardProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  progressLabel?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function RotatingGradientCard({
  title = "Untab Studio",
  progress = 92,
  progressLabel = "99 / 99",
  description = "Building components… please keep the project open until the process is complete.",
  className,
  children,
}: RotatingGradientCardProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-112 w-full max-w-120 items-center justify-center overflow-hidden rounded-3xl",
        className
      )}
    >
      <div className="absolute -inset-10 flex items-center justify-center">
        <div
          className="
            h-[120%] w-[120%] rounded-[36px] blur-3xl opacity-80
            bg-[conic-gradient(from_0deg,var(--color-emerald-400),var(--color-cyan-400),var(--color-blue-500),var(--color-violet-600),var(--color-red-500),var(--color-emerald-400))]
            animate-[spin_8s_linear_infinite]
          "
        />
      </div>

      <Card className="w-[340px] z-10 rounded-2xl border border-border/20 bg-card/95 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{title}</span>
            {progressLabel && (
              <span className="text-xs text-muted-foreground">{progressLabel}</span>
            )}
          </div>

          {progress !== undefined && (
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-cyan-400),var(--color-sky-400),var(--color-emerald-400))]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground">{description}</p>

          {children}
        </CardContent>
      </Card>
    </div>
  );
}

interface RotatingGradientRightProps {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  cardProps?: RotatingGradientCardProps;
}

export default function RotatingGradientRight({
  heading = "Untab Studio",
  subheading = "Build beautiful, modern interfaces with our comprehensive component library. No setup, no configuration needed.",
  cardProps,
}: RotatingGradientRightProps) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <RotatingGradientCard {...cardProps} />

      <div className="space-y-4">
        <h2 className="text-lg font-normal text-foreground leading-relaxed sm:text-xl lg:text-3xl">
          {heading}{" "}
          <span className="text-muted-foreground text-sm sm:text-base lg:text-3xl">
            {subheading}
          </span>
        </h2>
      </div>
    </div>
  );
}
