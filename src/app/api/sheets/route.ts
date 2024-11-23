// app/api/sheets/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { GoogleAuth, JWT } from 'google-auth-library';

// Initialize Google Sheets API
const SHEET_NAME = 'Teams';
const SHEET_PROB = 'Problems';

const SHEET_RANGE = `${SHEET_NAME}!A:B`;
const SHEET_PROB_RANGE = `${SHEET_PROB}!A:D`;

// Configure auth
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}');
/*const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
*/
const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const spreadsheetId = process.env.SHEET_ID;

// Helper function to get authenticated sheets instance
async function getAuthenticatedSheets() {
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient as JWT });
}

// Helper function to get all teams
async function getAllTeams(sheetsInstance: any) {
  const response = await sheetsInstance.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_RANGE,
  });
  return response.data.values || [];
}

async function getAllProbs(sheetsInstance: any) {
  const response = await sheetsInstance.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_PROB_RANGE,
  });
  return response.data.values || [];
}

export async function POST(request: Request) {
  try {
    // Validate spreadsheet ID
    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, message: 'Spreadsheet ID not configured' },
        { status: 500 }
      );
    }

    // Get authenticated sheets instance
    const sheetsInstance = await getAuthenticatedSheets();
    
    // Parse request body
    const body = await request.json();
    const { action, name, problemName } = body;

    switch (action) {
      case 'addTeam': {
        if (!name?.trim()) {
          return NextResponse.json(
            { success: false, message: 'Team name is required' },
            { status: 400 }
          );
        }

        // Get current teams and check for duplicates
        const teams = await getAllTeams(sheetsInstance);
        const exists = teams.some(
          (team: any) => team[0]?.toLowerCase() === name.toLowerCase()
        );

        if (exists) {
          return NextResponse.json(
            { success: false, message: 'Team already exists' },
            { status: 409 }
          );
        }

        // Add new team
        await sheetsInstance.spreadsheets.values.append({
          spreadsheetId,
          range: SHEET_RANGE,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[name, 0]],
          },
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Team added successfully' 
        });
      }

      case 'updateScore': {
        if (!name?.trim()) {
          return NextResponse.json(
            { success: false, message: 'Team name is required' },
            { status: 400 }
          );
        }

        if (!problemName?.trim()) {
          return NextResponse.json(
            { success: false, message: 'Problem name is required' },
            { status: 400 }
          );
        }

        // Find team
        const teams = await getAllTeams(sheetsInstance);
        const teamIndex = teams.findIndex(
          (team: any) => team[0]?.toLowerCase() === name.toLowerCase()
        );

        if (teamIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Team not found' },
            { status: 404 }
          );
        }

        // Find problem and get its score
        const problems = await getAllProbs(sheetsInstance);
        const problem = problems.find(
          (prob: any) => prob[0]?.toLowerCase() === problemName.toLowerCase()
        );

        if (!problem) {
          return NextResponse.json(
            { success: false, message: 'Problem not found' },
            { status: 404 }
          );
        }

        const problemScore = parseInt(problem[1]) || 0;

        // Update team's score
        const currentScore = parseInt(teams[teamIndex][1]) || 0;
        const newScore = currentScore + problemScore;

        await sheetsInstance.spreadsheets.values.update({
          spreadsheetId,
          range: `${SHEET_NAME}!B${teamIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[newScore]],
          },
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Score updated successfully' 
        });
      }

      case 'getTeams': {
        // Get and sort teams
        const teams = await getAllTeams(sheetsInstance);
        const sortedTeams = teams.sort((a: any, b: any) => {
          const scoreA = Number(a[1]) || 0;
          const scoreB = Number(b[1]) || 0;
          return scoreB - scoreA;
        });

        return NextResponse.json(sortedTeams);
      }

      case 'getProbs': {
        // Get and sort teams
        const probs = await getAllProbs(sheetsInstance);
        return NextResponse.json(probs);
      }

      case 'addProb': {
        const { name, score, pdfLink, solvers } = body;

        if (!name?.trim()) {
          return NextResponse.json(
            { success: false, message: 'Problem name is required' },
            { status: 400 }
          );
        }

        if (score === undefined || score < 0) {
          return NextResponse.json(
            { success: false, message: 'Valid score is required' },
            { status: 400 }
          );
        }

        if (!pdfLink?.trim()) {
          return NextResponse.json(
            { success: false, message: 'PDF link is required' },
            { status: 400 }
          );
        }

        if (solvers === undefined || solvers < 0) {
          return NextResponse.json(
            { success: false, message: 'Valid number of solvers is required' },
            { status: 400 }
          );
        }

        // Get current problems and check for duplicates
        const probs = await getAllProbs(sheetsInstance);
        const exists = probs.some(
          (prob: any) => prob[0]?.toLowerCase() === name.toLowerCase()
        );

        if (exists) {
          return NextResponse.json(
            { success: false, message: 'Problem already exists' },
            { status: 409 }
          );
        }

        // Add new problem
        await sheetsInstance.spreadsheets.values.append({
          spreadsheetId,
          range: SHEET_PROB_RANGE,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[name, score, pdfLink, solvers]],
          },
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Problem added successfully' 
        });
      }


      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}