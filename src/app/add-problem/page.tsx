import { cookies } from "next/headers";
import AddProblem from "./AddProblelm";
import { redirect } from "next/navigation";

export default async function AddProblemPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('auth')

  if (!authCookie) {
    redirect('/login')
  }
  return (
    <div className="container mx-auto p-4">
      <AddProblem />
    </div>
  )
} 