
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
        compact ? "py-1 px-4" : "pt-1.5 pb-2.5 px-4"
    )}>
      <div className="flex items-center justify-center gap-1.5 max-w-[360px] mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex-1 flex flex-col gap-1">
                <div 
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-500 relative",
                        isCompleted ? "bg-green-600" : 
                        isActive ? "bg-primary shadow-[0_0_10px_rgba(0,81,181,0.3)]" : 
                        "bg-slate-100"
                    )}
                >
                    {isActive && (
                        <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full" />
                    )}
                </div>
                {!compact && (
                    <span className={cn(
                        "text-[8px] font-black text-center uppercase transition-colors duration-300 tracking-widest",
                        isActive ? "text-primary" : isCompleted ? "text-green-700" : "text-slate-400"
                    )}>
                        {step.label}
                    </span>
                )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
