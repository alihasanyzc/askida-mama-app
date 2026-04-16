type ReverseGeocodeAddress = {
  display_name?: string;
  address?: {
    road?: string;
    pedestrian?: string;
    footway?: string;
    path?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    quarter?: string;
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
};

function compactAddress(parts: Array<string | undefined>) {
  return parts.map((part) => part?.trim()).filter(Boolean).join(', ');
}

function formatAddressLine(payload: ReverseGeocodeAddress) {
  const address = payload.address;

  if (!address) {
    return payload.display_name?.trim() ?? null;
  }

  const street = compactAddress([
    address.road ?? address.pedestrian ?? address.footway ?? address.path,
    address.house_number,
  ]);

  const locality = compactAddress([
    address.neighbourhood ?? address.suburb ?? address.quarter,
    address.village ?? address.town ?? address.city ?? address.municipality,
  ]);

  const region = compactAddress([
    address.county ?? address.state_district,
    address.state,
  ]);

  return (
    compactAddress([street, locality, region, address.postcode, address.country]) ||
    payload.display_name?.trim() ||
    null
  );
}

export async function reverseGeocodeCoordinates(latitude: number, longitude: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const searchParams = new URLSearchParams({
      format: 'jsonv2',
      lat: latitude.toString(),
      lon: longitude.toString(),
      'accept-language': 'tr',
      zoom: '18',
      addressdetails: '1',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status ${response.status}`);
    }

    const payload = (await response.json()) as ReverseGeocodeAddress;
    const addressLine = formatAddressLine(payload);

    if (!addressLine) {
      throw new Error('Reverse geocoding response did not include an address');
    }

    return addressLine;
  } finally {
    clearTimeout(timeoutId);
  }
}
