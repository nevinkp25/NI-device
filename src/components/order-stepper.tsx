
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
    <div className="w-full bg-white px-6 py-4 border-b-4 border-slate-100 shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* Background Connector Line */}
        <div className="absolute top-6 left-10 right-10 h-1 bg-slate-100 -z-0" />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center text-xl font-black border-4 transition-all duration-300",
                  isActive
                    ? "bg-[#0051B5] text-white border-[#0051B5] scale-125 shadow-lg shadow-blue-200"
                    : isCompleted
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-slate-300 border-slate-200"
                )}
              >
                {isCompleted ? <Check className="h-7 w-7 stroke-[4]" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-xs font-black tracking-tighter uppercase",
                  isActive ? "text-[#0051B5]" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}

        {/* Dynamic Progress Line Overlay */}
        <div 
          className="absolute top-6 left-10 h-1 bg-green-500 transition-all duration-500 -z-0" 
          style={{ 
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '42%' : '84%' 
          }} 
        />
      </div>
    </div>
  );
}
