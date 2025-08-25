// GynaecologistFinder.tsx - Frontend component for the gynecologist finder
import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

import { searchGynecologistsByPincode, type GynecologistData } from './api';

const GynaecologistFinder: React.FC = () => {
  // State management
  const [map, setMap] = useState<Map | null>(null);
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gynecologists, setGynecologists] = useState<GynecologistData[]>([]);
  const [searchArea, setSearchArea] = useState('');
  
  // Refs for map and popup
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source and layer for markers
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23e91e63"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
          scale: 1.5
        })
      })
    });
    
    vectorLayerRef.current = vectorLayer;

    // Create map
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([77.2090, 28.6139]), // Default to Delhi
        zoom: 10
      })
    });

    // Create popup overlay
    if (popupRef.current) {
      const popup = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10]
      });
      initialMap.addOverlay(popup);
    }

    setMap(initialMap);

    // Cleanup on unmount
    return () => {
      if (initialMap) {
        initialMap.setTarget(undefined);
      }
    };
  }, []);

  // Add click event listener to map
  useEffect(() => {
    if (map) {
      const handleMapClick = (event: any) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        
        if (feature) {
          const data = feature.get('data') as GynecologistData;
          const coordinates = event.coordinate;
          showPopup(coordinates, data);
        }
      };

      map.on('click', handleMapClick);
      
      return () => {
        map.un('click', handleMapClick);
      };
    }
  }, [map]);

  // Show popup with gynecologist details
  const showPopup = (coordinates: number[], data: GynecologistData) => {
    if (!map || !popupRef.current) return;

    const popup = map.getOverlays().getArray()[0];
    if (popup) {
      popup.setPosition(coordinates);
      
      popupRef.current.innerHTML = `
        <div class="popup-content">
          <h3>${data.name}</h3>
          <p><strong>Address:</strong> ${data.address}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.website ? `<p><strong>Website:</strong> <a href="${data.website}" target="_blank">${data.website}</a></p>` : ''}
          ${data.opening_hours ? `<p><strong>Hours:</strong> ${data.opening_hours}</p>` : ''}
        </div>
      `;
      popupRef.current.style.display = 'block';
    }
  };

  // Add markers to map
  const addMarkersToMap = (locations: GynecologistData[]) => {
    if (!map || !vectorLayerRef.current) return;

    const vectorSource = vectorLayerRef.current.getSource();
    if (!vectorSource) return;

    // Clear existing markers
    vectorSource.clear();

    // Add new markers
    locations.forEach(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.lng, location.lat])),
        data: location
      });

      vectorSource.addFeature(feature);
    });

    // Fit map to show all markers
    if (locations.length > 0) {
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (pincode.length !== 6) {
    setError('Please enter a valid 6-digit pincode');
    return;
  }

  setLoading(true);
  setError('');
  setGynecologists([]);
  setSearchArea('');

  try {
    const result = await searchGynecologistsByPincode(pincode);
    
    if (result.success && result.location) {
      setSearchArea(result.location.displayName);
      setGynecologists(result.gynecologists);

      if (map) {
        map.getView().setCenter(fromLonLat([result.location.lng, result.location.lat]));
        map.getView().setZoom(12);
      }

      addMarkersToMap(result.gynecologists);

      if (result.count === 0) {
        setError('No healthcare facilities found in this area. Try a different pincode.');
      }
    } else {
      // Better error messages
      if (result.error?.includes('504') || result.error?.includes('timeout')) {
        setError('Server is busy right now. Please try again in a few minutes or try a different pincode.');
      } else if (result.error?.includes('All Overpass endpoints failed')) {
        setError('Healthcare database is temporarily unavailable. Please try again later.');
      } else {
        setError(result.error || 'Search failed. Please try again.');
      }
    }
  } catch (error) {
    setError('An unexpected error occurred. Please try again in a few minutes.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Find Gynecologists Near You
        </h1>
        <p className="text-gray-600">Enter your pincode to find nearby women's healthcare providers</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Enter Your Area Pincode
            </h2>
            <input
              type="password"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="••••••"
              className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-lg"
              maxLength={6}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || pincode.length !== 6}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-colors shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Find Doctors'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-3">
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          Healthcare Facilities Map
          {searchArea && <span className="text-sm font-normal text-gray-600">({searchArea})</span>}
        </h2>
        
        <div
          ref={mapRef}
          className="w-full h-96 rounded-xl border border-pink-200"
          style={{ minHeight: '400px' }}
        />
        
        {/* Popup element */}
        <div
          ref={popupRef}
          className="popup bg-white p-4 rounded-lg shadow-lg border border-pink-200 max-w-sm"
          style={{ display: 'none' }}
        />
      </div>

      {/* Results List */}
      {gynecologists.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Found {gynecologists.length} Healthcare Facilities
          </h2>
          
          <div className="grid gap-4">
            {gynecologists.map((doctor) => (
              <div key={doctor.id} className="border border-pink-100 rounded-xl p-4 hover:bg-pink-50 transition-colors">
                <h3 className="font-bold text-lg text-purple-700">{doctor.name}</h3>
                <p className="text-gray-600 mb-2">{doctor.address}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {doctor.phone && (
                    <div className="flex items-center gap-1 text-green-600">
                      <span>📞</span>
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  {doctor.website && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <span>🌐</span>
                      <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  {doctor.opening_hours && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <span>🕒</span>
                      <span>{doctor.opening_hours}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .popup {
          position: absolute;
          background: white;
          border-radius: 8px;
          border: 2px solid #f3e8ff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 12px;
          min-width: 200px;
        }

        .popup-content h3 {
          margin: 0 0 8px 0;
          color: #7c3aed;
          font-weight: bold;
        }

        .popup-content p {
          margin: 4px 0;
          font-size: 14px;
        }

        .popup::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #f3e8ff;
        }
      `}</style>
    </div>
  );
};

export default GynaecologistFinder;
