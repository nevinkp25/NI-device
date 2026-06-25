
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
    <div className="w-full bg-white px-4 py-2 border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between max-w-sm mx-auto relative">
        {/* Background Connector Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100 -z-0" />
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300",
                  isActive
                    ? "bg-primary text-white border-primary scale-110 shadow-md"
                    : isCompleted
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-slate-300 border-slate-200"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[4]" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[8px] font-black tracking-tight uppercase",
                  isActive ? "text-primary" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}

        {/* Dynamic Progress Line Overlay */}
        <div 
          className="absolute top-4 left-6 h-0.5 bg-green-500 transition-all duration-500 -z-0" 
          style={{ 
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '45%' : '90%' 
          }} 
        />
      </div>
    </div>
  );
}
