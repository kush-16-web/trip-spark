import { useState, useRef, useEffect } from "react";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps{
    places: any[]; // Must visit places
    stays: any[]; //Hotels
    activites: any[]; //Current Day activities
    activeDay: number;
}

const TripMap = ({places, stays, activites, activeDay}: MapProps) =>{
    const mapRef = useRef<any>(null);
    const [viewState, setViewState] = useState({
        latitude: 20, //Default start
        longitude: 77,
        zoom: 2
    })

    //2. Logic to "fly" the map when the day changes
    useEffect(() => {
        if(activites.length > 0 && mapRef.current){
            const firstCoord = activites[0].coordinates;
            if(firstCoord){
                mapRef.current.flyTo({
                    center:[firstCoord.lng,firstCoord.lat],
                    zoom: 12,
                    duration: 2000
                });
            }
        }
    }, [activeDay, activites])

    return (
         <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
      <Map
        {...viewState}
        ref={mapRef}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11" // Premium Muted style
        mapboxAccessToken="PASTE_YOUR_TOKEN_HERE"
      >
        <NavigationControl position="top-right" />
        
        {/* 3. Render Markers for Places (Must Visit) */}
        {places.map((place, i) => (
          place.coordinates && (
            <Marker key={`place-${i}`} latitude={place.coordinates.lat} longitude={place.coordinates.lng}>
              <div className="group relative">
                <div className="w-6 h-6 bg-violet-600 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-125" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                  {place.title}
                </div>
              </div>
            </Marker>
          )
        ))}

        {/* 4. Render Markers for Stays (Hotels) */}
        {stays.map((stay, i) => (
          stay.coordinates && (
            <Marker key={`stay-${i}`} latitude={stay.coordinates.lat} longitude={stay.coordinates.lng}>
              <div className="group relative">
                <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-125" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                  🏨 {stay.name}
                </div>
              </div>
            </Marker>
          )
        ))}

        {/* 5. The Daily Route Line (Polyline) */}
        {activites.length > 1 && (
          <Source
            id="route-source"
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: activites
                  .filter(a => a.coordinates)
                  .map(a => [a.coordinates.lng, a.coordinates.lat])
              }
            }}
          >
            <Layer
              id="route-layer"
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{ 'line-color': '#7c3aed', 'line-width': 4, 'line-dasharray': [2, 1] }}
            />
          </Source>
        )}
      </Map>
    </div>
    );
};

export default TripMap;
