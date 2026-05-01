"use client";

import {
  slideInFromLeft,
  slideInFromRight,
  staggerContainerSlow,
} from "@unified-ui/motion";
import { cn } from "@unified-ui/utils/cn";
// ============================================================================
// Unified UI — Timeline Component
// ============================================================================
// Vertical timeline with icons, connectors, and alternating layout.
import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

export type TimelineVariant = "default" | "outlined" | "filled";
export type TimelineSize = "sm" | "md" | "lg";
export type TimelineAlign = "left" | "right" | "alternate";
export type TimelineItemStatus =
  | "default"
  | "active"
  | "success"
  | "warning"
  | "danger"
  | "pending";

export interface TimelineItemData {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: ReactNode;
  status?: TimelineItemStatus;
  content?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItemData[];
  align?: TimelineAlign;
  size?: TimelineSize;
  animated?: boolean;
  className?: string;
}

export interface TimelineItemProps {
  title?: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: ReactNode;
  status?: TimelineItemStatus;
  isLast?: boolean;
  align?: "left" | "right";
  size?: TimelineSize;
  animated?: boolean;
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}

const statusDotMap: Record<TimelineItemStatus, string> = {
  default: "bg-border",
  active: "bg-primary ring-4 ring-primary/20",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  pending: "bg-muted border-2 border-border",
};

const statusIconColorMap: Record<TimelineItemStatus, string> = {
  default: "bg-muted border border-border text-muted-foreground",
  active: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  pending: "bg-muted border border-border/60 text-muted-foreground",
};

const dotSizeMap: Record<TimelineSize, string> = {
  sm: "size-2",
  md: "size-3",
  lg: "size-4",
};

const iconSizeMap: Record<TimelineSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  function TimelineItem(
    {
      title,
      description,
      timestamp,
      icon,
      status = "default",
      isLast = false,
      size = "md",
      animated = true,
      side = "right",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const shouldReduce = useReducedMotion();
    const slidePreset = side === "left" ? slideInFromRight : slideInFromLeft;

    return (
      <motion.div
        ref={ref}
        className={cn("flex gap-4 relative", className)}
        variants={animated && !shouldReduce ? slidePreset.variants : undefined}
        transition={
          animated && !shouldReduce ? slidePreset.transition : undefined
        }
        role="listitem"
        data-ds-animated={animated ? "" : undefined}
        {...rest}
      >
        {/* Connector + icon column */}
        <div className="flex flex-col items-center">
          {/* Icon or dot */}
          {icon ? (
            <div
              className={cn(
                "flex items-center justify-center rounded-full shrink-0 z-10",
                iconSizeMap[size],
                statusIconColorMap[status],
              )}
            >
              {icon}
            </div>
          ) : (
            <div
              className={cn(
                "rounded-full shrink-0 z-10 mt-1.5",
                dotSizeMap[size],
                statusDotMap[status],
              )}
            />
          )}
          {/* Connector line */}
          {!isLast && <div className="flex-1 w-px bg-border mt-2 mb-0" />}
        </div>

        {/* Content */}
        <div className={cn("flex-1 pb-8", isLast && "pb-0")}>
          {timestamp && (
            <p className="text-xs text-muted-foreground mb-1 leading-none">
              {timestamp}
            </p>
          )}
          {title && (
            <p
              className={cn(
                "font-semibold text-foreground leading-5",
                size === "sm"
                  ? "text-xs"
                  : size === "md"
                    ? "text-sm"
                    : "text-base",
              )}
            >
              {title}
            </p>
          )}
          {description && (
            <p
              className={cn(
                "text-muted-foreground leading-5 mt-0.5",
                size === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </motion.div>
    );
  },
);
TimelineItem.displayName = "TimelineItem";

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline(
    { items, align = "left", size = "md", animated = true, className, ...rest },
    ref,
  ) {
    const shouldReduce = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        className={cn("relative", className)}
        variants={
          animated && !shouldReduce ? staggerContainerSlow.variants : undefined
        }
        initial={animated && !shouldReduce ? "initial" : undefined}
        animate={animated && !shouldReduce ? "animate" : undefined}
        role="list"
        aria-label="Timeline"
        data-ds=""
        data-ds-component="timeline"
        data-ds-align={align}
        data-ds-animated={animated ? "" : undefined}
        {...rest}
      >
        {items.map((item, i) => (
          <TimelineItem
            key={item.id ?? i}
            title={item.title}
            description={item.description}
            timestamp={item.timestamp}
            icon={item.icon}
            status={item.status ?? "default"}
            isLast={i === items.length - 1}
            size={size}
            animated={animated}
            side={
              align === "alternate" ? (i % 2 === 0 ? "right" : "left") : "right"
            }
          >
            {item.content}
          </TimelineItem>
        ))}
      </motion.div>
    );
  },
);
Timeline.displayName = "Timeline";
