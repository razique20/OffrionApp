import React from 'react';
import { 
  ShieldAlert, 
  Key, 
  BookOpen, 
  ArrowRight, 
  Terminal,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function Error403Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-none shadow-destructive/10 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">Error 403: Access Denied</h1>
          <p className="text-muted-foreground text-lg font-medium">Your request reached us, but your API credentials failed validation.</p>
        </div>

        <div className="grid gap-6">
           <div className="p-8 bg-card border border-border rounded-md shadow-none space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                 <Terminal className="text-foreground w-5 h-5" />
                 Common Causes
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-4">
                    <div className="p-2 bg-secondary rounded-lg h-fit text-muted-foreground"><Key className="w-4 h-4" /></div>
                    <div>
                       <h4 className="font-bold text-sm">Missing or Malformed Header</h4>
                       <p className="text-xs text-muted-foreground mt-1">Ensure your request includes the `x-api-key` header with your valid production key.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="p-2 bg-secondary rounded-lg h-fit text-muted-foreground"><RefreshCcw className="w-4 h-4" /></div>
                    <div>
                       <h4 className="font-bold text-sm">Expired or Inactive Key</h4>
                       <p className="text-xs text-muted-foreground mt-1">Keys can be deactivated manually from the Partner Dashboard. Verify the key status in your connectivity settings.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="p-2 bg-secondary rounded-lg h-fit text-muted-foreground"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                       <h4 className="font-bold text-sm">Restricted Access</h4>
                       <p className="text-xs text-muted-foreground mt-1">Your account may not have the necessary permissions to access this specific endpoint or resource.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/partner/api-keys" className="flex-1">
                 <button className="w-full p-6 bg-secondary text-foreground border border-border rounded-md font-bold text-sm shadow-none shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    Check Dashboard <ArrowRight className="w-4 h-4" />
                 </button>
              </Link>
              <Link href="/docs" className="flex-1">
                 <button className="w-full p-6 bg-secondary text-foreground rounded-md font-bold text-sm hover:bg-secondary/80 transition-all flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" /> Full API Docs
                 </button>
              </Link>
           </div>
        </div>

        <footer className="text-center pt-8 border-t border-border/50">
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Offrion Developer Relations &bull; Secure API Infrastructure</p>
        </footer>
      </div>
    </div>
  );
}
