import { cookies } from "next/headers";
import AddTeam from "./AddTeam";
import { redirect } from "next/navigation";


export default async function AddTeamPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('auth')

  if (!authCookie) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <AddTeam />
    </div>
  )
}