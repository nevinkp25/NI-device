
"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
    <div className="w-full bg-background border-b border-slate-100">
      <div className="flex h-12 items-stretch">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div 
              key={step.id} 
              className={cn(
                "flex-1 flex items-center justify-center gap-2 relative transition-all duration-300 px-1",
                isActive ? "bg-primary/5" : "bg-transparent"
              )}
            >
              {/* Status Indicator */}
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors duration-300",
                isCompleted ? "bg-green-500 text-white" : 
                isActive ? "bg-primary text-white shadow-sm" : 
                "bg-slate-100 text-slate-400"
              )}>
                {isCompleted ? <Check className="h-3 w-3 stroke-[4]" /> : step.id}
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] font-black tracking-tight uppercase whitespace-nowrap transition-colors duration-300",
                isActive ? "text-primary" : 
                isCompleted ? "text-green-600" : 
                "text-slate-400"
              )}>
                {step.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-1 bg-primary rounded-t-full animate-in fade-in slide-in-from-bottom-1" />
              )}

              {/* Connector (if needed) */}
              <div className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-4 bg-slate-100",
                step.id === steps.length && "hidden"
              )} />
            </div>
          )
        })}
      </div>
    </div>
  );
}
