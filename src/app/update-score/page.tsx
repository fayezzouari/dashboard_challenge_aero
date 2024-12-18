import { cookies } from 'next/headers'
import UpdateScore  from './UpdateScore'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('auth')

  if (!authCookie) {
    redirect('/login')
  }
  
  return (
    <div className="container mx-auto p-4">
      <UpdateScore />
    </div>
  )
}


