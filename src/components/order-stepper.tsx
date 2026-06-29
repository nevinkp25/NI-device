
"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface Step {
  id: number;
  label: string;
}

const DEFAULT_STEPS: Step[] = [
  { id: 1, label: "TABLE" },
  { id: 2, label: "MENU" },
  { id: 3, label: "ORDER" },
];

export function OrderStepper({ 
  currentStep, 
  steps = DEFAULT_STEPS,
  compact = false
}: { 
  currentStep: number; 
  steps?: Step[];
  compact?: boolean;
}) {
  return (
    <div className={cn(
        "w-full bg-white transition-all duration-300",
        compact ? "py-1 px-4 border-b shadow-sm" : "py-2.5 px-6"
    )}>
      <div className="flex items-start justify-center max-w-[400px] mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Unit (Circle + Label) */}
              <div className="flex flex-col items-center shrink-0">
                {/* Numbered Circle */}
                <div className={cn(
                  "rounded-full flex items-center justify-center font-black transition-all duration-500",
                  compact ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[10px]",
                  (isActive || isCompleted) 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-white border-2 border-slate-200 text-slate-500"
                )}>
                  {step.id}
                </div>
                
                {/* Step Text Label */}
                {!compact && (
                  <span className={cn(
                    "text-[8px] font-black uppercase mt-1.5 tracking-widest transition-colors duration-300",
                    (isActive || isCompleted) ? "text-primary" : "text-slate-600"
                  )}>
                    {step.label}
                  </span>
                )}
              </div>

              {/* Horizontal Connecting Bridge */}
              {!isLast && (
                <div className={cn(
                  "flex-grow h-[1px] mx-1.5 transition-colors duration-700",
                  compact ? "mt-[9.5px]" : "mt-[13.5px]",
                  isCompleted ? "bg-primary" : "bg-slate-200"
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  );
}
