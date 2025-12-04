"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, CameraOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
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
        // Here you would typically use a library to decode the QR code from the video stream.
        // For this demo, we'll just simulate a successful scan.
        toast({
          title: 'QR Code Scanned!',
          description: 'Table 12 identified. Loading menu...',
        });
        router.push('/menu');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasCameraPermission, router, toast]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">Scan QR Code</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="relative w-full max-w-sm aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                    <CameraOff className="h-16 w-16 text-destructive mb-4" />
                    <p className="text-destructive-foreground">Camera access denied.</p>
                </div>
            )}
             <div className="absolute inset-0 border-4 border-primary/50 rounded-lg" style={{
                clipPath: 'polygon(0% 0%, 0% 25%, 25% 25%, 25% 0%, 100% 0%, 100% 25%, 75% 25%, 75% 0%, 0% 0%)'
             }}/>

            <div className="absolute w-2/3 h-2/3">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
            </div>
        </div>

        <QrCode className="h-10 w-10 text-primary animate-pulse" />
        <h2 className="text-xl font-semibold">Point Camera at QR Code</h2>
        <p className="text-muted-foreground">Scanning for a table QR code to start an order.</p>

        {hasCameraPermission === false && (
            <Alert variant="destructive" className="max-w-sm">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    To scan a QR code, please allow camera access in your browser settings.
                </AlertDescription>
            </Alert>
        )}
      </main>
    </div>
  );
}
