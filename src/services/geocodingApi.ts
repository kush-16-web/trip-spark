export interface DestinationSuggestion {
  id: string;
  name: string;
  city?: string;
  country?: string;
  lat: number;
  lng: number;
}

export async function searchDestinations(query: string): Promise<DestinationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const fetchResults = async (nameQuery: string): Promise<any[]> => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nameQuery)}&count=20&language=en&format=json`,
    );
    const data = await response.json();
    return data.results ?? [];
  };

  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';

  const preferredCountry =
    locale.toLowerCase().endsWith('-in') || timezone.includes('Kolkata') ? 'India' : undefined;
  const normalizedQuery = trimmed.toLowerCase();

  const primaryResults = await fetchResults(trimmed);
  const countryBiasedResults = preferredCountry ? await fetchResults(`${trimmed}, ${preferredCountry}`) : [];

  const byId = new Map<string, any>();
  [...countryBiasedResults, ...primaryResults].forEach((result) => {
    const key = `${result.latitude}-${result.longitude}`;
    if (!byId.has(key)) byId.set(key, result);
  });
  const results = Array.from(byId.values());

  results.sort((a: any, b: any) => {
    const aName = String(a.name ?? '').toLowerCase();
    const bName = String(b.name ?? '').toLowerCase();
    const aCountry = String(a.country ?? '');
    const bCountry = String(b.country ?? '');
    const aPopulation = Number(a.population ?? 0);
    const bPopulation = Number(b.population ?? 0);

    const aExact = aName === normalizedQuery ? 1 : 0;
    const bExact = bName === normalizedQuery ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    const aStarts = aName.startsWith(normalizedQuery) ? 1 : 0;
    const bStarts = bName.startsWith(normalizedQuery) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;

    const aPreferred = preferredCountry && aCountry === preferredCountry ? 1 : 0;
    const bPreferred = preferredCountry && bCountry === preferredCountry ? 1 : 0;
    if (aPreferred !== bPreferred) return bPreferred - aPreferred;

    if (aPopulation !== bPopulation) return bPopulation - aPopulation;

    return aName.localeCompare(bName);
  });

  return results.slice(0, 8).map((result: any) => ({
    id: `${result.latitude}-${result.longitude}`,
    name: `${result.name}, ${result.country ?? ''}`.trim(),
    city: result.name,
    country: result.country,
    lat: result.latitude,
    lng: result.longitude,
  }));
}