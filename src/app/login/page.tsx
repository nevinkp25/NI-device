"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UserCheck, Store, Menu, ShieldAlert, DollarSign, Settings, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StaffLoginPage() {
  const [staffId, setStaffId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = localStorage.getItem('restaurantSlug');
      if (slug) {
        // Reflect input from main login screen, ensuring spaces are hyphens and it's uppercase
        setRestaurantName(slug.trim().replace(/\s+/g, '-').toUpperCase());
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid ID",
        description: "Employee ID must be exactly 6 digits.",
      });
      return;
    }

    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('staffId', staffId);
    }
    
    toast({
        title: "Access Granted",
        description: `Welcome back, Staff #${staffId}`,
    });

    setTimeout(() => {
      router.push('/navigation');
    }, 800);
  };

  const handleManualSale = () => {
    toast({
      title: "Manual Sales Mode",
      description: "Entering transaction history and manual sale terminal.",
    });
    router.push('/transaction-history');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 relative">
      {/* Quick Access Menu - Top Right */}
      <div className="fixed top-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-900 hover:bg-slate-100 rounded-full h-12 w-12 border-2 border-slate-100">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-slate-200 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-2">Terminal Systems</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="rounded-xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => toast({ title: "Supervisor Mode", description: "Manager credential override required." })}
            >
              <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Supervisor Menu</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={handleManualSale}
            >
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Manual Sales</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => router.push('/settings')}
            >
              <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-center mb-12 animate-in fade-in duration-700">
        <div className="h-20 w-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Store className="h-10 w-10 text-primary" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{restaurantName || 'BRANCH TERMINAL'}</p>
        <h1 className="text-3xl font-bold text-slate-900">Staff Login</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <Input
            id="staffId"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            value={staffId}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 6) setStaffId(val);
            }}
            disabled={isLoading}
            className="text-center text-4xl h-24 font-bold border-2 border-slate-100 rounded-2xl focus-visible:ring-primary/20 tabular-nums"
            autoFocus
          />
          <p className="text-center text-xs text-slate-400 font-medium">Enter your 6-digit employee identification number</p>
        </div>
        
        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            disabled={isLoading || staffId.length !== 6}
            className="w-full h-16 text-lg font-bold bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6" />
                <span>START SHIFT</span>
              </div>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleManualSale}
            className="w-full h-14 text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em] hover:bg-slate-50 hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            <span>Manual Sales Mode</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </form>

      <div className="mt-20 text-center flex justify-center">
        <svg width="146" height="47" viewBox="0 0 146 47" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_4395_7534)">
            <path d="M37.4142 14.8083V15.4141C37.4142 15.6408 37.4142 15.8304 37.3944 16.0199H22.4907C22.5104 16.7957 22.6829 17.5167 23.0278 18.2163C23.3727 18.9178 23.7967 19.4846 24.3536 19.9965C24.9106 20.4889 25.5447 20.8857 26.2741 21.1904C27.0035 21.4738 27.7724 21.6066 28.579 21.6066C29.8473 21.6066 30.9414 21.3232 31.8828 20.7918C32.8044 20.2427 33.5158 18.7849L36.6651 20.8485C35.6465 22.1557 34.4949 23.1211 33.1116 23.7464C31.7678 24.3521 30.23 24.655 28.579 24.655C27.1382 24.655 25.8519 24.4283 24.6411 23.9536C23.4302 23.4807 22.3937 22.8359 21.5098 21.9839C20.6457 21.1514 19.954 20.1276 19.4546 18.9355C18.9551 17.7416 18.6857 16.4167 18.6857 14.9589C18.6857 13.5011 18.9354 12.2133 19.415 10.9823C19.8947 9.75122 20.6061 8.72917 21.4505 7.87717C22.3146 7.02517 23.3709 6.34322 24.5423 5.87028C25.7333 5.39734 27.0196 5.15112 28.3652 5.15112C29.7108 5.15112 30.9773 5.37785 32.1109 5.81359C33.2445 6.24934 34.2039 6.89232 34.953 7.72661C35.7399 8.55913 36.3363 9.56346 36.7585 10.7573C37.2202 12.0079 37.4106 13.3328 37.4106 14.8101L37.4142 14.8083ZM33.6308 13.3328C33.611 12.6137 33.496 11.9122 33.2661 11.2692C33.0361 10.6262 32.7092 10.0754 32.287 9.60243C31.8648 9.12949 31.3079 8.76991 30.654 8.48473C30.0018 8.20132 29.2527 8.06847 28.3688 8.06847C27.582 8.06847 26.813 8.20132 26.1412 8.48473C25.4297 8.76814 24.8549 9.12772 24.3159 9.60243C23.8165 10.0754 23.3943 10.6245 23.0476 11.2692C22.7026 11.9122 22.5104 12.5942 22.4907 13.3328H33.6308Z" fill="#0069B1"/>
            <path d="M74.9627 5.71942L70.7176 19.9785L66.1275 5.71942H62.2093L57.6965 19.9785L53.4136 5.71942H49.3805L55.6413 24.2208H59.502L64.0921 10.339H64.1693L68.7971 24.2208H72.6775L78.8809 5.71942H74.9627Z" fill="#0069B1"/>
            <path d="M98.7413 14.9235C98.7413 16.3636 98.4915 17.669 97.9723 18.8629C97.4729 20.0568 96.7238 21.0788 95.8399 21.968C94.9381 22.82 93.862 23.5215 92.6331 23.9944C91.3846 24.4673 90.0785 24.7136 88.6377 24.7136C87.1969 24.7136 85.8711 24.4673 84.6423 23.9944C83.3937 23.5215 82.3374 22.82 81.4355 21.968C80.5337 21.116 79.8223 20.055 79.3229 18.8629C78.8234 17.669 78.554 16.3636 78.554 14.9235C78.554 13.4834 78.8037 12.178 79.3229 11.0036C79.8223 9.80974 80.5337 8.80718 81.4355 7.95517C82.3374 7.10317 83.4135 6.42122 84.6423 5.94828C85.8909 5.47534 87.1969 5.22913 88.6377 5.22913C90.0785 5.22913 91.4043 5.47534 92.6331 5.94828C93.8817 6.42122 94.9381 7.08369 95.8399 7.95517C96.7417 8.82666 97.4729 9.84871 97.9723 11.0036C98.4915 12.1975 98.7413 13.5029 98.7413 14.9235ZM94.8608 14.9412C94.8608 14.052 94.7261 13.2177 94.4386 12.4224C94.1512 11.6076 93.7667 10.9257 93.2278 10.3199C92.6906 9.71409 92.0367 9.24115 91.2498 8.8426C90.463 8.48303 89.5791 8.2935 88.5802 8.2935C87.5814 8.2935 86.6975 8.48303 85.9106 8.8426C85.1238 9.20218 84.4698 9.6946 83.9327 10.3199C83.3955 10.9451 83.0111 11.6271 82.7218 12.4224C82.4344 13.2372 82.2997 14.0697 82.2997 14.9412C82.2997 15.8127 82.4344 16.6647 82.7218 17.46C83.0093 18.2554 83.3937 18.994 83.9327 19.5998C84.4698 20.2056 85.1238 20.7175 85.9106 21.0771C86.6975 21.4366 87.5814 21.6262 88.5802 21.6262C89.5791 21.6262 90.463 21.4366 91.2498 21.0771C92.0367 20.7175 92.6906 20.2251 93.2278 19.5998C93.7649 18.994 94.1494 18.2748 94.4386 17.46C94.7458 16.6647 94.8608 15.8322 94.8608 14.9412Z" fill="#0069B1"/>
            <path d="M116.776 -6.10352e-05H113.05V24.2209H116.776V-6.10352e-05Z" fill="#0069B1"/>
            <path d="M47.8998 8.52172V5.71951H43.2128V-6.10352e-05H39.5245V18.7475C39.5245 20.6605 40.0042 22.0988 40.9258 23.0837C41.8474 24.049 43.211 24.5238 44.9787 24.5238C45.5734 24.5238 46.1123 24.4671 46.6692 24.3909C47.1112 24.3147 47.5136 24.2209 47.8801 24.088V21.0573C47.5926 21.1707 47.2854 21.2468 46.9585 21.3407C46.5543 21.4169 46.1896 21.4541 45.8644 21.4541C44.9428 21.4541 44.2511 21.2079 43.829 20.7349C43.4068 20.262 43.2146 19.4667 43.2146 18.349V8.53943L47.9016 8.51995L47.8998 8.52172Z" fill="#0069B1"/>
            <path d="M109.899 5.22711C108.631 5.22711 107.499 5.5672 106.501 6.23145C105.482 6.89392 104.58 7.7654 104.081 8.86362V5.71954H100.567V24.2209H104.293V14.5052C104.293 13.7294 104.408 12.9713 104.6 12.2521C104.792 11.533 105.137 10.9272 105.561 10.3586C105.983 9.8095 106.54 9.39324 107.194 9.05137C107.846 8.71128 108.635 8.55895 109.537 8.55895C110.131 8.55895 110.688 8.61563 111.227 8.74848V5.34048C110.843 5.2466 110.42 5.22711 109.901 5.22711H109.899Z" fill="#0069B1"/>
            <path d="M16.3069 9.81049C16.0194 8.9018 15.5954 8.1242 15.0206 7.42453C14.4259 6.76206 13.7343 6.19347 12.8504 5.81441C11.9863 5.41586 10.9299 5.20862 9.71908 5.20862C9.04719 5.20862 8.3753 5.28478 7.74113 5.49203C7.12673 5.68156 6.53029 5.92777 5.99313 6.25015C5.45598 6.59024 5.01404 6.95159 4.59186 7.38556C4.16968 7.80182 3.74751 8.27476 3.49779 8.76718V5.73647H0V24.2378H3.72595V14.4088C3.72595 12.572 4.20561 11.0752 5.12722 9.99647C6.04883 8.87878 7.25967 8.32967 8.73819 8.32967C9.60231 8.32967 10.3137 8.49972 10.8706 8.80261C11.4276 9.1055 11.8497 9.52176 12.1569 10.0532C12.4641 10.5828 12.6941 11.1709 12.8091 11.8528C12.924 12.5153 12.9815 13.2344 12.9815 13.9926V24.2378H16.7272V12.7615C16.7272 11.7005 16.5925 10.7156 16.3051 9.80694L16.3069 9.81049Z" fill="#0069B1"/>
            <path d="M124.688 5.71942H129.278L121.366 15.0365L129.163 24.2208H124.573L116.776 15.0365L124.688 5.71942Z" fill="#0069B1"/>
            <path d="M137.819 5.65881H133.247L141.128 14.9387L133.362 24.0875H137.934L145.7 14.9387L137.819 5.65881Z" fill="#FF2E56"/>
          </g>
          <defs>
            <clipPath id="clip0_4395_7534">
              <rect width="145.7" height="47" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
