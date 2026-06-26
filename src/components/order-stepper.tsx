
"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: "TABLE" },
  { id: 2, label: "MENU" },
  { id: 3, label: "ORDER" },
];

export function OrderStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full bg-background pt-3 pb-4">
      <div className="flex items-center justify-center px-4 max-w-[360px] mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label Group */}
              <div className="flex flex-col items-center gap-2 z-10 min-w-[60px]">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 border-[2.5px]",
                  isCompleted 
                    ? "bg-green-600 border-green-600 text-white" 
                    : isActive 
                      ? "bg-primary border-primary text-white shadow-lg scale-110" 
                      : "bg-white border-slate-300 text-slate-500"
                )}>
                  {isCompleted ? <Check className="h-5 w-5 stroke-[4]" /> : step.id}
                </div>
                <span className={cn(
                  "text-[11px] font-bold tracking-wider uppercase transition-colors duration-300",
                  isActive ? "text-primary underline underline-offset-4" : isCompleted ? "text-green-700" : "text-slate-600"
                )}>
                  {step.label}
                </span>
              </div>

              {/* Progress Line */}
              {!isLast && (
                <div className="flex-grow h-[3px] -mt-6 bg-slate-200">
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
