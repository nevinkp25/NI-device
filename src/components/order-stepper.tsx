"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
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
  steps = DEFAULT_STEPS 
}: { 
  currentStep: number; 
  steps?: Step[] 
}) {
  return (
    <div className="w-full bg-background pt-1.5 pb-2.5">
      <div className="flex items-center justify-center px-4 max-w-[360px] mx-auto relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label Group */}
              <div className="flex flex-col items-center gap-1 z-10 relative flex-1 min-w-[60px]">
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 border-2",
                  isCompleted 
                    ? "bg-green-600 border-green-600 text-white" 
                    : isActive 
                      ? "bg-primary border-primary text-white shadow-sm scale-105" 
                      : "bg-white border-slate-300 text-slate-600"
                )}>
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[4]" /> : step.id}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase transition-colors duration-300",
                  isActive ? "text-primary" : isCompleted ? "text-green-700" : "text-slate-600"
                )}>
                  {step.label}
                </span>
              </div>

              {/* Progress Line */}
              {!isLast && (
                <div className="flex-grow h-[2px] -mt-4 bg-slate-200 mx-0 z-0">
                   <div className={cn(
                     "h-full transition-all duration-700 ease-in-out",
                     isCompleted ? "bg-green-600 w-full" : "w-0"
                   )} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  );
}