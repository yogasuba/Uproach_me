// app/events/page.js
import { listEvents } from '../../lib/googleCalendar';

export default async function Events() {
  let events = [];
  try {
    events = await listEvents();
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div>
      <h1>Upcoming Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.summary}</li>
        ))}
      </ul>
    </div>
  );
}
