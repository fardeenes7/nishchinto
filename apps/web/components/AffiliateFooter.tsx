"use client";

import React from 'react';
import Link from 'next/link';

interface AffiliateFooterProps {
  isForceAffiliate?: boolean;
  shopReferralCode?: string;
}

/**
 * Implements the conditional footer logic outlined in Phase 0.2
 * Free plans force this to render. Paid plans can toggle it off.
 */
export function AffiliateFooter({ isForceAffiliate = false, shopReferralCode = 'default' }: AffiliateFooterProps) {
  // If a paid shop toggled this off, we wouldn't render the component at all from the parent,
  // but to be safe, we can enforce isForceAffiliate check if we implemented an internal state.
  
  return (
    <footer className="w-full py-4 border-t border-border mt-auto bg-muted">
      <div className="container mx-auto flex items-center justify-center text-sm text-muted-foreground">
        <Link 
          href={`https://nishchinto.com.bd?ref=${shopReferralCode}`}
          target="_blank"
          referrerPolicy="no-referrer"
          className="hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="font-semibold tracking-wide">
            ⚡ Powered by Nishchinto
          </span>
        </Link>
      </div>
    </footer>
  );
}
