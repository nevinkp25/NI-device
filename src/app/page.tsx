
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Building2, Menu, ShieldAlert, Settings, DollarSign, FileText, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RestaurantEntryPage() {
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('restaurantSlug', slug.toLowerCase());
    }
    
    toast({
        title: "Accessing Terminal",
        description: `Connecting to ${slug.toUpperCase()} branch...`,
    });

    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('restaurantSlug');
      localStorage.removeItem('staffId');
    }
    toast({
      title: "Terminal Session Reset",
      description: "Clearing local terminal cache...",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0051B5] p-8 text-white relative">
      {/* Quick Access Burger Menu */}
      <div className="fixed top-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-12 w-12 border-2 border-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-3xl p-2 border-slate-200 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-3">Terminal Systems</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => toast({ title: "Supervisor Mode", description: "Manager override required." })}
            >
              <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Supervisor Menu</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => router.push('/transaction-history')}
            >
              <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Manual Sale</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => router.push('/settings')}
            >
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-emerald-50" 
              onClick={() => toast({ title: "Z-Report", description: "Calculating daily totals..." })}
            >
              <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Z-Report</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-red-50" 
              onClick={handleLogout}
            >
              <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Refined Branding Header with SVG Logo */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700 w-full max-w-[280px]">
        <div className="mb-4 flex justify-center">
          <svg width="263" height="85" viewBox="0 0 263 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <g clipPath="url(#clip0_4393_6835)">
              <path d="M67.4572 26.6992V27.7914C67.4572 28.2002 67.4572 28.5419 67.4216 28.8836H40.5503C40.5859 30.2824 40.8969 31.5823 41.5188 32.8437C42.1407 34.1084 42.9051 35.1304 43.9092 36.0534C44.9133 36.9412 46.0567 37.6566 47.3717 38.2059C48.6868 38.7169 50.0731 38.9564 51.5275 38.9564C53.8142 38.9564 55.7868 38.4454 57.4841 37.4873C59.1457 36.4973 60.4284 35.2677 61.3969 33.8689L66.1065 37.5895C64.2699 39.9464 62.1937 41.687 59.6996 42.8143C57.2768 43.9065 54.5042 44.4527 51.5275 44.4527C48.9297 44.4527 46.6106 44.0439 44.4274 43.188C42.2443 42.3353 40.3754 41.1728 38.7818 39.6366C37.2238 38.1356 35.9767 36.2897 35.0763 34.1404C34.1758 31.9879 33.6899 29.599 33.6899 26.9706C33.6899 24.3423 34.1402 22.0205 35.005 19.8009C35.8698 17.5813 37.1525 15.7386 38.6749 14.2024C40.2329 12.6663 42.1374 11.4367 44.2493 10.584C46.3968 9.73133 48.716 9.28741 51.142 9.28741C53.5681 9.28741 55.8516 9.6962 57.8955 10.4818C59.9393 11.2675 61.669 12.4268 63.0197 13.931C64.4384 15.432 65.5137 17.2428 66.2749 19.3953C67.1074 21.65 67.4507 24.0389 67.4507 26.7024L67.4572 26.6992ZM60.6357 24.0389C60.6001 22.7422 60.3928 21.4776 59.9782 20.3183C59.5636 19.159 58.9741 18.1658 58.2129 17.313C57.4517 16.4603 56.4476 15.812 55.2686 15.2979C54.0928 14.7869 52.7421 14.5473 51.1485 14.5473C49.7298 14.5473 48.3435 14.7869 47.1321 15.2979C45.8494 15.8088 44.8129 16.4571 43.8412 17.313C42.9407 18.1658 42.1795 19.1558 41.5544 20.3183C40.9325 21.4776 40.5859 22.7071 40.5503 24.0389H60.6357Z" fill="white"/>
              <path d="M135.156 10.3121L127.502 36.021L119.227 10.3121H112.162L104.026 36.021L96.3038 10.3121H89.0321L100.32 43.6697H107.281L115.557 18.6411H115.696L124.04 43.6697H131.036L142.221 10.3121H135.156Z" fill="white"/>
              <path d="M178.029 26.9068C178.029 29.5032 177.579 31.857 176.643 34.0095C175.742 36.162 174.391 38.0047 172.798 39.6079C171.172 41.1441 169.232 42.4088 167.016 43.2615C164.765 44.1142 162.41 44.5581 159.812 44.5581C157.215 44.5581 154.824 44.1142 152.609 43.2615C150.358 42.4088 148.453 41.1441 146.827 39.6079C145.201 38.0718 148.453 41.1441 146.827 39.6079C145.201 38.0718 143.918 36.1588 143.018 34.0095C142.117 31.857 141.632 29.5032 141.632 26.9068C141.632 24.3104 142.082 21.9566 143.018 19.8393C143.918 17.6867 145.201 15.8791 146.827 14.343C148.453 12.8069 150.393 11.5773 152.609 10.7246C154.86 9.8719 157.215 9.42798 159.812 9.42798C162.41 9.42798 164.801 9.8719 167.016 10.7246C169.267 11.5773 171.172 12.7717 172.798 14.343C174.424 15.9143 175.742 17.757 176.643 19.8393C177.579 21.9918 178.029 24.3455 178.029 26.9068ZM171.033 26.9387C171.033 25.3355 170.79 23.8313 170.271 22.3974C169.753 20.9283 169.06 19.6987 168.088 18.6065C167.12 17.5143 165.941 16.6616 164.522 15.943C163.103 15.2947 161.51 14.953 159.709 14.953C157.908 14.953 156.314 15.2947 154.896 15.943C153.477 16.5913 152.298 17.4792 151.329 18.6065C150.361 19.7339 149.668 20.9634 149.146 22.3974C148.628 23.8664 148.385 25.3675 148.385 26.9387C148.385 28.51 148.628 30.0462 149.146 31.4801C149.664 32.914 150.358 34.2458 151.329 35.338C152.298 36.4303 153.477 37.3532 154.896 38.0015C156.314 38.6498 157.908 38.9916 159.709 38.9916C161.51 38.9916 163.103 38.6498 164.522 38.0015C165.941 37.3532 167.12 36.4654 168.088 35.338C169.057 34.2458 169.75 32.9492 170.271 31.4801C170.825 30.0462 171.033 28.5451 171.033 26.9387Z" fill="white"/>
              <path d="M210.546 -0.00012207H203.828V43.6698H210.546V-0.00012207Z" fill="white"/>
              <path d="M86.3626 15.3645V10.3122H77.9119V-0.00012207H71.2621V33.8014C71.2621 37.2506 72.1269 39.8438 73.7886 41.6195C75.4502 43.36 77.9086 44.2159 81.0959 44.2159C82.168 44.2159 83.1397 44.1137 84.1438 43.9764C84.9407 43.8391 85.6662 43.6698 86.327 43.4303V37.9659C85.8087 38.1703 85.2548 38.3077 84.6653 38.4769C83.9365 38.6143 83.279 38.6813 82.6927 38.6813C81.0311 38.6813 79.7841 38.2374 79.0229 37.3847C78.2617 36.532 77.9151 35.098 77.9151 33.0829V15.3964L86.3658 15.3613L86.3626 15.3645Z" fill="white"/>
              <path d="M198.147 9.42438C195.86 9.42438 193.82 10.0376 192.019 11.2352C190.182 12.4296 188.556 14.0009 187.656 15.9809V10.3122H181.32V43.6698H188.038V26.1527C188.038 24.7539 188.245 23.387 188.592 22.0904C188.938 20.7938 189.56 19.7015 190.325 18.6764C191.086 17.6863 192.09 16.9358 193.269 16.3195C194.445 15.7063 195.867 15.4316 197.493 15.4316C198.565 15.4316 199.569 15.5338 200.541 15.7733V9.62877C199.848 9.45951 199.086 9.42438 198.15 9.42438H198.147Z" fill="white"/>
              <path d="M29.401 17.6881C28.8827 16.0498 28.1183 14.6478 27.0818 13.3863C26.0097 12.1919 24.7627 11.1667 23.169 10.4833C21.611 9.76471 19.7065 9.39105 17.5233 9.39105C16.3119 9.39105 15.1005 9.52838 13.9571 9.90204C12.8494 10.2438 11.774 10.6877 10.8055 11.2689C9.83704 11.8821 9.04023 12.5336 8.27905 13.316C7.51787 14.0665 6.75669 14.9193 6.30646 15.8071V10.3428H0V43.7004H6.71782V25.9788C6.71782 22.667 7.58265 19.9684 9.24429 18.0235C10.9059 16.0083 13.0891 15.0183 15.7548 15.0183C17.3128 15.0183 18.5955 15.3248 19.5996 15.871C20.6037 16.4171 21.3649 17.1676 21.9188 18.1257C22.4726 19.0806 22.8872 20.1409 23.0945 21.3704C23.3018 22.5648 23.4055 23.8615 23.4055 25.2283V43.7004H30.1589V23.0088C30.1589 21.0958 29.916 19.3201 29.3978 17.6818L29.401 17.6881Z" fill="white"/>
              <path d="M224.81 10.3121H233.086L218.821 27.1107L232.879 43.6697H224.603L210.545 27.1107L224.81 10.3121Z" fill="white"/>
              <path d="M248.485 10.2027H240.241L254.451 26.9342L240.449 43.4294H248.692L262.695 26.9342L248.485 10.2027Z" fill="#FF2E56"/>
              <path d="M178.732 84.709C176.555 84.709 174.654 83.9138 173.028 82.3201C171.402 80.7265 170.589 78.5995 170.589 75.9328C170.589 73.2661 171.402 71.1967 173.028 69.5934C174.654 67.9902 176.555 67.1886 178.732 67.1886C181.414 67.1886 183.591 68.3799 185.259 70.7655V60.6225H187.798V84.3513H185.259V80.9692C183.545 83.4603 181.369 84.709 178.732 84.709ZM179.195 82.467C180.844 82.467 182.282 81.8507 183.513 80.6147C184.744 79.3788 185.359 77.8075 185.359 75.9009C185.359 73.9943 184.744 72.4933 183.513 71.2701C182.282 70.0469 180.844 69.4338 179.195 69.4338C177.547 69.4338 176.053 70.0246 174.91 71.2062C173.767 72.3879 173.196 73.9751 173.196 75.968C173.196 77.9608 173.779 79.4618 174.942 80.6658C176.108 81.8698 177.524 82.4702 179.195 82.4702V82.467Z" fill="white"/>
              <path d="M192.051 63.8719V61.1094H194.953V63.8719H192.051ZM192.216 84.3496V67.5446H194.756V84.3496H192.216Z" fill="white"/>
              <path d="M199.173 84.35V67.545H201.712V70.4704C203.053 68.2828 204.997 67.1873 207.549 67.1873C209.57 67.1873 211.164 67.8005 212.33 69.0237C213.496 70.2469 214.076 71.8788 214.076 73.9164V84.35H211.537V74.5327C211.537 72.9519 211.125 71.7095 210.299 70.8121C209.477 69.9115 208.317 69.4644 206.82 69.4644C205.324 69.4644 204.129 69.953 203.16 70.9271C202.192 71.9012 201.709 73.169 201.709 74.7307V84.3532H199.17L199.173 84.35Z" fill="white"/>
              <path d="M219.515 76.9727C219.69 78.6845 220.344 80.045 221.478 81.051C222.608 82.0602 223.956 82.5616 225.517 82.5616C227.561 82.5616 229.352 81.7695 230.89 80.1887L232.474 81.5875C230.563 83.6889 228.221 84.7396 225.452 84.7396C223.055 84.7396 221.04 83.9221 219.401 82.2869C217.763 80.6518 216.946 78.544 216.946 75.9635C216.946 73.383 217.727 71.4413 219.288 69.7391C220.849 68.0369 222.793 67.1873 225.125 67.1873C227.457 67.1873 229.498 68.0337 230.926 69.7231C232.355 71.4125 233.07 73.5363 233.07 76.0944C233.07 76.4202 233.061 76.7108 233.038 76.9727H219.521H219.515ZM219.515 74.9575H230.492C230.337 73.3319 229.796 71.9842 228.86 70.9111C227.927 69.8381 226.657 69.3015 225.05 69.3015C223.599 69.3015 222.359 69.8317 221.325 70.8952C220.292 71.9587 219.687 73.3128 219.512 74.9575H219.515Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_4393_6835">
                <rect width="262.695" height="84.7402" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <div className="text-center">
            <label htmlFor="restaurantSlug" className="inline-block text-[11px] font-bold opacity-60 uppercase tracking-widest mb-1">
                Enter Restaurant Slug
            </label>
          </div>
          
          <div className="relative group">
              <Input
                id="restaurantSlug"
                type="text"
                placeholder="Restaurant-Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isLoading}
                className="text-center text-xl h-16 font-bold bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder:text-white/20 focus-visible:ring-white/40 uppercase tracking-tight transition-all"
                autoFocus
              />
              <div className="mt-4 flex items-center justify-center gap-1.5 opacity-30">
                  <span className="h-1 w-1 bg-white rounded-full"></span>
                  <p className="text-[9px] font-bold uppercase tracking-widest">Enterprise Validation Required</p>
                  <span className="h-1 w-1 bg-white rounded-full"></span>
              </div>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !slug}
          className="w-full h-16 text-lg font-bold bg-white text-[#0051B5] hover:bg-white/90 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            <>
              <Building2 className="h-5 w-5" />
              <span>ACCESS TERMINAL</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
      
      <footer className="fixed bottom-10 flex flex-col items-center gap-2 opacity-20">
          <div className="h-1 w-24 bg-white/30 rounded-full" />
      </footer>
    </div>
  );
}
