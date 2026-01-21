export const dynamic = 'force-dynamic'

import React from 'react'

export default function Footer() {
  return (
    <footer className='border-t py-8 px-6 bg-background'>
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 rounded bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-xs'>F</span>
          </div>
          <span className='font-semibold'>FOOMO</span>
        </div>
        <p className='text-sm text-muted-foreground'>
          © 2026 FOOMO. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
