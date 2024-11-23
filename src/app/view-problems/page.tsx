'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'

export default function ViewProblems() {
  const [problems, setProblems] = useState([])

  useEffect(() => {
    fetchProblems()

    // Set up an interval to fetch problems every 10 seconds
    const interval = setInterval(() => {
      fetchProblems()
    }, 10000) // 10 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval)
  }, [])

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getProbs' }),
      })
      const data = await response.json()
      setProblems(data)
    } catch (error) {
      console.error('Error fetching problems:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Problems List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Solvers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={problem[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {problem[0]}
                    </Link>
                  </TableCell>
                  <TableCell>{problem[1]}</TableCell>
                  <TableCell>{problem[3]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

