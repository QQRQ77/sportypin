import MultipleMarkersMap from '@/components/GoogleMapsComponent'
import MapExample from '@/components/LeafletMapComponent'
import { Button } from '@/components/ui/button'
import React from 'react'

const Page = () => {
  return (
    <div className='mx-auto'>
      <h1 className='mx-auto text-2xl font-bold'>SportyPin</h1>
      <p>Cały sport w jednym miejscu</p>
      <p>Wkrótce więcej informacji!</p>
      <Button>Zapisz się do newslettera</Button>
      <div className='h-20'></div>
      <div className='w-full flex justify-center'>
        <MultipleMarkersMap/>
      </div>
    </div>
  )
}

export default Page