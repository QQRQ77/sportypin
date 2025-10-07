// import { createUser } from '@/lib/users.actions';
// import { auth } from '@clerk/nextjs/server';
import {redirect} from 'next/navigation'

const Page = async () => {
  redirect("/events");
  // const session = await auth();
  // if ( session.userId ) {await createUser()}

  return (
    <div className='mx-auto'>
      <h1 className='mx-auto text-2xl font-bold'>SportyPin</h1>
    </div>
  )
}

export default Page