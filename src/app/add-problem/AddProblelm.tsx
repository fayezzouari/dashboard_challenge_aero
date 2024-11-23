'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function AddProblem() {

  const [name, setName] = useState('')
  const [score, setScore] = useState('')
  const [pdfLink, setPdfLink] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addProb',
          name,
          score: parseInt(score),
          pdfLink,
          solvers: 0,
        }),
      })

      const data = await res.json()
      const router = useRouter()
      if (data.success) {
        setSuccess('Problem added successfully!')
        setName('')
        setScore('')
        setPdfLink('')
        router.refresh()
      } else {
        setError(data.message || 'Failed to add problem')
      }
    } catch (err) {
      setError('An error occurred while adding the problem')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Problem Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdfLink">PDF Link</Label>
              <Input
                id="pdfLink"
                type="url"
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                required
              />
            </div>
     
            <Button type="submit" className="w-full">Add Problem</Button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
      
      <div className="mt-4">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      </CardContent>

      </Card>
    </div>

  )
}

