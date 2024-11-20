// app/api/sheets/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

// Initialize Google Sheets API
const SHEET_NAME = 'Teams';
const SHEET_RANGE = `${SHEET_NAME}!A:B`;

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
  return google.sheets({ version: 'v4', auth: authClient });
}

// Helper function to get all teams
async function getAllTeams(sheetsInstance: any) {
  const response = await sheetsInstance.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_RANGE,
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
    const { action, teamName, score } = body;

    switch (action) {
      case 'addTeam': {
        if (!teamName?.trim()) {
          return NextResponse.json(
            { success: false, message: 'Team name is required' },
            { status: 400 }
          );
        }

        // Get current teams and check for duplicates
        const teams = await getAllTeams(sheetsInstance);
        const exists = teams.some(
          (team: any) => team[0]?.toLowerCase() === teamName.toLowerCase()
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
            values: [[teamName, 0]],
          },
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Team added successfully' 
        });
      }

      case 'updateScore': {
        if (!teamName?.trim()) {
          return NextResponse.json(
            { success: false, message: 'Team name is required' },
            { status: 400 }
          );
        }

        if (score === undefined || score < 0) {
          return NextResponse.json(
            { success: false, message: 'Valid score is required' },
            { status: 400 }
          );
        }

        // Find team
        const teams = await getAllTeams(sheetsInstance);
        const teamIndex = teams.findIndex(
          (team: any) => team[0]?.toLowerCase() === teamName.toLowerCase()
        );

        if (teamIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Team not found' },
            { status: 404 }
          );
        }

        // Update score
        await sheetsInstance.spreadsheets.values.update({
          spreadsheetId,
          range: `${SHEET_NAME}!B${teamIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[parseInt(score)+(parseInt(teams[teamIndex][1]))]],
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