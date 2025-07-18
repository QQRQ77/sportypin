import { Button } from '@/components/ui/button'
import { createUser } from '@/lib/users.actions';
import { auth } from '@clerk/nextjs/server';

const Page = async () => {
  const session = await auth();
  if ( session.userId ) {await createUser()}

  return (
    <div className='mx-auto'>
      <h1 className='mx-auto text-2xl font-bold'>SportyPin</h1>
      <p>Cały sport w jednym miejscu</p>
      <p>Wkrótce więcej informacji!</p>
      <Button>Zapisz się do newslettera</Button>
      <div className='h-20'></div>
    </div>
  )
}

export default Page