export const dynamic = 'force-dynamic'

import React from 'react'

export default function Footer() {
  return (
    <footer className='border-t border-border/50 py-12 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-primary-foreground font-bold text-sm'>
                F
              </span>
            </div>
            <span className='font-bold text-xl tracking-tight'>FOOMO</span>
          </div>

          <nav className='flex items-center gap-8'>
            <a
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              data-testid='link-about'
            >
              About
            </a>
            <a
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              data-testid='link-careers'
            >
              Careers
            </a>
            <a
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              data-testid='link-privacy'
            >
              Privacy
            </a>
            <a
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              data-testid='link-terms'
            >
              Terms
            </a>
          </nav>

          <p
            className='text-sm text-muted-foreground'
            data-testid='text-copyright'
          >
            © 2026 FOOMO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
