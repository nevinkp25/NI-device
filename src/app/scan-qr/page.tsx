
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, CameraOff, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function ScanQrPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Hardware Conflict',
          description: 'This terminal does not support direct camera access.',
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Access Restricted',
          description: 'Please authorize camera permissions in terminal settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  // Simulate scanning a QR code and navigating
  useEffect(() => {
    if(hasCameraPermission) {
      const timer = setTimeout(() => {
        toast({
          title: 'QR Code Validated',
          description: 'Table #12 identified. Initializing menu...',
        });
        router.push('/menu?table=12');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [hasCameraPermission, router, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 flex items-center p-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex flex-col items-center mx-auto">
            <h1 className="text-sm font-bold uppercase tracking-widest">Optical Scanner</h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none mt-0.5">Terminal v2.4 Active</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-700">
        <div className="relative w-full max-w-sm aspect-square bg-black rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-2xl ring-1 ring-white/10">
            <video 
                ref={videoRef} 
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-1000",
                    hasCameraPermission ? "opacity-70" : "opacity-0"
                )} 
                autoPlay 
                muted 
                playsInline 
            />
            
            {/* Scanning Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-scan pointer-events-none" />

            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-8">
                    <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <CameraOff className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Camera Restricted</h3>
                    <p className="text-xs text-slate-400 mt-2">Hardware validation failed or permission was denied by the system administrator.</p>
                </div>
            )}

            {/* Corner Guides */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 relative">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-primary rounded-tl-3xl shadow-[0_0_15px_rgba(0,81,181,0.5)]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-primary rounded-tr-3xl shadow-[0_0_15px_rgba(0,81,181,0.5)]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-primary rounded-bl-3xl shadow-[0_0_15px_rgba(0,81,181,0.5)]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-primary rounded-br-3xl shadow-[0_0_15px_rgba(0,81,181,0.5)]"></div>
                </div>
            </div>
        </div>

        <div className="space-y-4 max-w-[280px]">
            <div className="flex justify-center">
                <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <QrCode className="h-6 w-6 text-primary animate-pulse" />
                </div>
            </div>
            <div className="space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-tight">Detecting Code</h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
                    Position the table QR code within the frame to automatically identify guest account.
                </p>
            </div>
        </div>

        {hasCameraPermission === false && (
            <Alert variant="destructive" className="max-w-sm bg-red-950/20 border-red-900/50 rounded-2xl">
                <AlertTitle className="text-sm font-bold uppercase tracking-tight">Permission Error</AlertTitle>
                <AlertDescription className="text-xs opacity-70">
                    To continue, please enable camera access in your terminal's operating system settings.
                </AlertDescription>
            </Alert>
        )}
      </main>

      <footer className="p-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Secure AES-256 Validation</span>
        </div>
        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Network Dine POS Infrastructure</p>
      </footer>

      <style jsx global>{`
        @keyframes scan {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(320px); opacity: 0; }
        }
        .animate-scan {
            animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
