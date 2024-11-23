'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'


export default  function AddTeam() {
 
  const [newTeamName, setNewTeamName] = useState('')

  const addTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addTeam', teamName: newTeamName }),
    })
    setNewTeamName('')
    alert('Team added successfully!')
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTeam} className="space-y-4">
            <Input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team Name"
              required
            />
            <Button type="submit">Add Team</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}