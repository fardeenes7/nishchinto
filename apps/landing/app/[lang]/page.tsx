import en from '@/dictionaries/en.json';
import bn from '@/dictionaries/bn.json';
import Link from 'next/link';
import { SSOHandshakeIframe } from '@repo/ui/components/SSOHandshake'; // Import from shared modular package
import { WaitlistForm } from '../../components/WaitlistForm';
import { AffiliateFooter } from '../../components/AffiliateFooter';

const dictionaries = { en, bn };

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = dictionaries[lang as keyof typeof dictionaries] ?? dictionaries.bn;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      
      {/* Invisible SSO tracker to sync JWT cross-domain */}
      <SSOHandshakeIframe />
      
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          {dict.hero.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {dict.hero.subtitle}
        </p>
        
        <div className="pt-8 w-full flex justify-center">
          <WaitlistForm />
        </div>
      </div>
      
      {/* Footer push to bottom contextually */}
      <div className="mt-20 w-full relative bottom-0 left-0">
         <AffiliateFooter isForceAffiliate={true} />
      </div>
    </main>
  );
}
