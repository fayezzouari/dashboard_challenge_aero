'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'


export default function UpdateScore() {

  const [updateTeamName, setUpdateTeamName] = useState('')
  const [updateProblemName, setUpdateProblemName] = useState('')
  // Predefined list of teams
  const fetchTeams = async () => {
    const response = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getTeams' }),
    })
    const data = await response.json()
    return data
  }

  const fetchProbs = async () => {
    const response = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getProbs' }),
    })
    const data = await response.json()
    return data
  }

  const [teamNames, setTeamNames] = useState<string[]>([])
  const [problemName, setProblemName] = useState<string[]>([])

 useEffect(() => {
    fetchTeams().then((data) => {
      setTeamNames(data)
    })
    fetchProbs().then((data) => {
      setProblemName(data)
    })
  }, [])
  

  const updateTeamScore = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateScore', name: updateTeamName, problemName: updateProblemName }),
    })
    setUpdateTeamName('')
    setUpdateProblemName('')
    alert('Score updated successfully!')
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Update Team Score</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateTeamScore} className="space-y-4">
            {/* Select Input for Team Name */}
            <select
              value={updateTeamName}
              onChange={(e) => setUpdateTeamName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Team</option>
              {teamNames.map((team, index) => (
                <option key={index} value={team[0]}>
                  {team[0]}
                </option>
              ))}
            </select>

            <select
              value={updateProblemName}
              onChange={(e) => setUpdateProblemName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Team</option>
              {problemName.map((prob, index) => (
                <option key={index} value={prob[0]}>
                  {prob[0]}
                </option>
              ))}
            </select>
            <Button type="submit">Update Score</Button>
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
