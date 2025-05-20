import axios from 'axios';

async function getSydneyBarsWithWebsites() {
  const SydneyBarsQuery = `
    [out:json][timeout:25];
    (
      node["amenity"~"bar|pub"]["website"](around:10000,-33.8688,151.2093);
      node["amenity"~"bar|pub"]["contact:website"](around:10000,-33.8688,151.2093);
      way["amenity"~"bar|pub"]["website"](around:10000,-33.8688,151.2093);
      way["amenity"~"bar|pub"]["contact:website"](around:10000,-33.8688,151.2093);
      relation["amenity"~"bar|pub"]["website"](around:10000,-33.8688,151.2093);
      relation["amenity"~"bar|pub"]["contact:website"](around:10000,-33.8688,151.2093);
    );
    out center;
  `;

  const res = await axios.post(
    'https://overpass-api.de/api/interpreter',
    overpassQuery,
    {
      headers: { 'Content-Type': 'text/plain' },
    }
  );

  const elements = res.data.elements;

  const cleaned = elements.map((el: any) => ({
    id: el.id,
    name: el.tags?.name,
    website: el.tags?.website || el.tags?.['contact:website'],
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    tags: el.tags,
  }));

  return cleaned;
}

getSydneyBarsWithWebsites().then((data) => {
  console.log(data);
  console.log(`Fetched ${data.length} bars/pubs with websites in Sydney:`);
});
