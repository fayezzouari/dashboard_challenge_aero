'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ViewStandings() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    fetchTeams()

    // Set up an interval to fetch teams every 10 seconds
    const interval = setInterval(() => {
      fetchTeams()
    }, 10000) // 10 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval)
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getTeams' }),
      })
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team, index) => (
                <TableRow key={index}>
                  <TableCell>{team[0]}</TableCell>
                  <TableCell>{team[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
