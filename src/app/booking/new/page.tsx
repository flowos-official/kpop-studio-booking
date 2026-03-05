'use client'

import { Suspense } from 'react'
import BookingPageContent from '../[id]/page'

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
      <BookingPageContent params={Promise.resolve({ id: 'new' })} />
    </Suspense>
  )
}
