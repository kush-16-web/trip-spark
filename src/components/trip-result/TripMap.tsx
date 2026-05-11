import { useState, useRef, useEffect } from "react";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoia3VzaC0xNiIsImEiOiJjbW9zdDNrNTgwMmVrMnJzMWtyMHV4aWhsIn0.G7L6LjqBCdAyqcx3fVpXug'

interface MapProps {
  places: any[]; // Must visit places
  stays: any[]; // Hotels
  activites: any[]; // Current Day activities
  activeDay: number;
  destination: string;
}

const HotelMarker = ({ stay, onMarkerClick }: { stay: any, onMarkerClick: (coords: any) => void }) => {
  const [coords] = useState(stay.coordinates);

  // Disabled for V1 to ensure production readiness without Google API verification
  /*
  useEffect(() => {
    if (!coords?.lat || !coords?.lng) {
      const fetchCoords = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/trip/hotel/details?name=${encodeURIComponent(stay.name)}&city=${encodeURIComponent(destination)}`);
          const data = await res.json();
          if (data.ok && data.details?.lat && data.details?.lng) {
            setCoords({ lat: data.details.lat, lng: data.details.lng });
          }
        } catch (err) {
          console.error("Error fetching hotel coords for map:", err);
        }
      };
      fetchCoords();
    }
  }, [stay.name, destination, coords]);
  */

  if (!coords?.lat || !coords?.lng) return null;

  return (
    <Marker
      latitude={Number(coords.lat)}
      longitude={Number(coords.lng)}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onMarkerClick({ lat: Number(coords.lat), lng: Number(coords.lng) });
      }}
    >
      <div className="group relative">
        <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-125" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
          {stay.name}
        </div>
      </div>
    </Marker>
  );
};

const TripMap = ({ places, stays, activites, activeDay, destination: _destination }: MapProps) => {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    latitude: 20, 
    longitude: 77,
    zoom: 2
  })

  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11");

  useEffect(() => {
    if (activites.length > 0 && mapRef.current) {
      const firstCoord = activites[0].coordinates;
      if (firstCoord) {
        mapRef.current.flyTo({
          center: [firstCoord.lng, firstCoord.lat],
          zoom: 15,
          duration: 2000
        });
      }
    }
  }, [activeDay, activites])

  const handleMarkerClick = (coords: { lat: number, lng: number }) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [coords.lng, coords.lat],
        zoom: 20,
        duration: 1500,
        essential: true
      });
    }
  };

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
      <div className="relative w-full h-full">
        <button
          onClick={() => setMapStyle(prev =>
            prev === 'mapbox://styles/mapbox/light-v11'
              ? 'mapbox://styles/mapbox/satellite-streets-v12'
              : 'mapbox://styles/mapbox/light-v11'
          )}
          className="absolute bottom-10 right-4 z-[100] p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 hover:bg-white transition-all duration-500 active:scale-95 group"
          title="Toggle Satellite View"
        >
          <span className="text-xl group-hover:rotate-12 transition-all duration-5000 inline-block">
            {mapStyle.includes('satellite') ? '🏙️' : '🛰️'}
          </span>
        </button>
        <Map
          {...viewState}
          ref={mapRef}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={mapStyle} 
          mapboxAccessToken={mapboxgl.accessToken ?? ''}
        >
          <NavigationControl position="top-right" />

          {places.map((place, i) => (
            place.coordinates?.lat && place.coordinates?.lng && (
              <Marker
                key={`place-${i}`}
                latitude={Number(place.coordinates.lat)}
                longitude={Number(place.coordinates.lng)}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick({ lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng) });
                }}
              >
                <div className="group relative">
                  <div className="w-6 h-6 bg-black rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-125" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                    {place.title || place.name}
                  </div>
                </div>
              </Marker>
            )
          ))}

          {stays.map((stay, i) => (
            <HotelMarker
              key={`stay-${i}`}
              stay={stay}
              onMarkerClick={handleMarkerClick}
            />
          ))}

          {activites.map((activity, i) => (
            activity.coordinates?.lat && activity.coordinates?.lng && (
              <Marker
                key={`activity-${i}`}
                latitude={Number(activity.coordinates.lat)}
                longitude={Number(activity.coordinates.lng)}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick({ lat: Number(activity.coordinates.lat), lng: Number(activity.coordinates.lng) });
                }}
              >
                <div className="group relative cursor-pointer">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center font-black text-xs group-hover:scale-125 group-hover:bg-black transition-all duration-300">
                    {i + 1}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                    {activity.title}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              </Marker>
            )
          ))}

          {activites.length > 1 && (
            <Source
              id="route"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: activites.map(a => [
                    Number(a.coordinates.lng),
                    Number(a.coordinates.lat)
                  ])
                }
              }}
            >
              <Layer
                id="route-layer"
                type="line"
                paint={{
                  "line-color": "#000",
                  "line-width": 4,
                  "line-dasharray": [2, 1]
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
};

export default TripMap;
