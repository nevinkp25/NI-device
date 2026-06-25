
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
    <div className="w-full bg-background pt-2 pb-3">
      <div className="flex items-center justify-center px-4 max-w-[320px] mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label Group */}
              <div className="flex flex-col items-center gap-1.5 z-10 min-w-[50px]">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 border-2",
                  isCompleted 
                    ? "bg-green-500 border-green-500 text-white" 
                    : isActive 
                      ? "bg-primary border-primary text-white shadow-md scale-105" 
                      : "bg-white border-slate-200 text-slate-300"
                )}>
                  {isCompleted ? <Check className="h-4 w-4 stroke-[4]" /> : step.id}
                </div>
                <span className={cn(
                  "text-[9px] font-black tracking-widest uppercase transition-colors duration-300",
                  isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-slate-400"
                )}>
                  {step.label}
                </span>
              </div>

              {/* Progress Line */}
              {!isLast && (
                <div className="flex-grow h-[2px] -mt-5 bg-slate-100">
                   <div className={cn(
                     "h-full transition-all duration-700 ease-in-out",
                     isCompleted ? "bg-green-500 w-full" : "w-0"
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
