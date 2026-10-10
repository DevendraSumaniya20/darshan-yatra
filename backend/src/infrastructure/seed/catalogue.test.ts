import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { seedDepartures, seedYatras } from './catalogue.ts';

const mediaDir = fileURLToPath(new URL('../../../media', import.meta.url));

describe('seed catalogue', () => {
  it('has a file in the media folder for every cover and gallery photograph', () => {
    const paths = seedYatras.flatMap((yatra) => [
      ...(yatra.photo ? [yatra.photo.path] : []),
      ...yatra.gallery.map((photo) => photo.path),
    ]);
    const missing = [...new Set(paths)].filter(
      (photoPath) => !existsSync(path.join(mediaDir, photoPath.replace(/^\/media\//, ''))),
    );

    assert.deepEqual(missing, []);
  });

  it('serves every photograph from the media route', () => {
    for (const yatra of seedYatras) {
      for (const photo of [...(yatra.photo ? [yatra.photo] : []), ...yatra.gallery]) {
        assert.match(photo.path, /^\/media\/photos\/[a-z0-9/-]+\.jpg$/);
      }
    }
  });

  it('gives each yatra an itinerary day for every day of its length', () => {
    for (const yatra of seedYatras) {
      assert.equal(yatra.itinerary.length, yatra.durationDays, yatra.slug);
    }
  });

  it('does not book more seats than a departure has', () => {
    for (const departure of seedDepartures) {
      assert.ok(departure.seatsBooked <= departure.seatsTotal, departure.id);
    }
  });
});
