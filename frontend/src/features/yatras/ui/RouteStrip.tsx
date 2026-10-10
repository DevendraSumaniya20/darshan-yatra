import type { YatraDetail } from '../model/yatra';
import './RouteStrip.css';

type RouteStripProps = {
  yatra: Pick<YatraDetail, 'startCity' | 'endCity' | 'itinerary'>;
};

/** The towns of the route in order: start city, each new overnight stop, end city. */
function routeStops(yatra: RouteStripProps['yatra']): string[] {
  const towns = [
    yatra.startCity,
    ...yatra.itinerary.flatMap((day) => (day.overnight ? [day.overnight] : [])),
    yatra.endCity,
  ];
  return towns.filter((town, index) => town !== towns[index - 1]);
}

export function RouteStrip({ yatra }: RouteStripProps) {
  const stops = routeStops(yatra);

  return (
    <div className="route-strip">
      <h2 className="route-strip__title">The route</h2>
      <ol className="route-strip__stops">
        {stops.map((stop, index) => (
          // A town can be visited twice, so the position is part of the key.
          <li key={`${index}-${stop}`}>{stop}</li>
        ))}
      </ol>
    </div>
  );
}
