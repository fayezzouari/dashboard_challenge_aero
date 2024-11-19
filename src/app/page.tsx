import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Competition Dashboard</h1>
      <div className="flex flex-col space-y-4">
        <Link href="/add-team">
          <Button className="w-full">Add New Team</Button>
        </Link>
        <Link href="/update-score">
          <Button className="w-full">Update Team Score</Button>
        </Link>
        <Link href="/view-standings">
          <Button className="w-full">View Team Standings</Button>
        </Link>
      </div>
    </div>
  )
}