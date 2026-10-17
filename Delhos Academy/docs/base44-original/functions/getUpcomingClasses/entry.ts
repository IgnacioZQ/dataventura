import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Obtener conexión con Google Calendar (service role, no requiere auth de usuario)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Obtener eventos próximos desde Google Calendar
    const now = new Date().toISOString();
    const maxTime = new Date();
    maxTime.setDate(maxTime.getDate() + 30); // Próximos 30 días

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${encodeURIComponent(now)}&` +
      `timeMax=${encodeURIComponent(maxTime.toISOString())}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=20`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Google Calendar API error: ${response.status}`, details: errText, events: [] }, { status: 500 });
    }

    const data = await response.json();

    return Response.json({
      events: data.items || [],
      success: true
    });

  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    return Response.json({
      error: error.message,
      events: []
    }, { status: 500 });
  }
});