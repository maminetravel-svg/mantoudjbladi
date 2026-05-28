import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MapPin, Check, X, Search, Satellite, Map as MapIcon } from 'lucide-react'

interface SearchResult {
  display_name: string
  lat: number
  lon: number
}

interface MapPickerProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
  onClose: () => void
}

export default function MapPicker({ lat, lng, onChange, onClose }: MapPickerProps) {
  const defaultLat = lat ?? 28.0
  const defaultLng = lng ?? 2.5

  const [pos, setPos] = useState<[number, number]>([defaultLat, defaultLng])
  const [satellite, setSatellite] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    let L: any
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css' as any)]).then(([leaflet]) => {
      L = leaflet.default
      if (!mapRef.current || leafletMap.current) return

      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: [pos[0], pos[1]],
        zoom: lat ? 13 : 5,
        zoomControl: true,
      })

      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      })
      const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19,
      })
      osm.addTo(map)

      const marker = L.marker([pos[0], pos[1]], { draggable: true }).addTo(map)
      marker.on('dragend', (e: any) => {
        const { lat: la, lng: ln } = e.target.getLatLng()
        setPos([parseFloat(la.toFixed(5)), parseFloat(ln.toFixed(5))])
      })

      map.on('click', (e: any) => {
        const { lat: la, lng: ln } = e.latlng
        const newPos: [number, number] = [parseFloat(la.toFixed(5)), parseFloat(ln.toFixed(5))]
        setPos(newPos)
        marker.setLatLng(newPos)
      })

      leafletMap.current = { map, marker, osm, sat, L }
    }).catch(() => {})

    return () => {
      if (leafletMap.current) {
        leafletMap.current.map.remove()
        leafletMap.current = null
      }
    }
  }, [])

  const toggleSatellite = () => {
    const m = leafletMap.current
    if (!m) return
    if (!satellite) {
      m.map.removeLayer(m.osm)
      m.sat.addTo(m.map)
    } else {
      m.map.removeLayer(m.sat)
      m.osm.addTo(m.map)
    }
    setSatellite(v => !v)
  }

  const flyTo = (la: number, ln: number) => {
    const m = leafletMap.current
    if (!m) return
    m.map.flyTo([la, ln], 13, { duration: 1 })
    m.marker.setLatLng([la, ln])
    setPos([la, ln])
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    setResults([])
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    if (!value.trim()) return
    searchTimeout.current = setTimeout(async () => {
      setSearching(true)
      // Capture search bar position for dropdown placement
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect()
        setDropdownRect({ top: rect.bottom + 4, left: rect.left, width: rect.width })
      }
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&countrycodes=dz&limit=5&format=json&accept-language=ar`
        const res = await fetch(url, { headers: { 'Accept-Language': 'ar' } })
        const data = await res.json()
        setResults(data.map((r: any) => ({
          display_name: r.display_name,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
        })))
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 600)
  }

  const handleConfirm = () => {
    onChange(pos[0], pos[1])
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black bg-opacity-60" dir="rtl">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-md">
        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={22} className="text-gray-600" />
        </button>
        <div className="text-center">
          <h2 className="font-black text-gray-800 text-base">📍 حدد موقع حقلك</h2>
          <p className="text-xs text-gray-400">ابحث عن الولاية أو اضغط على الخريطة</p>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1"
        >
          <Check size={16} />
          تأكيد
        </button>
      </div>

      {/* Search bar */}
      <div ref={searchBarRef} className="bg-white border-b border-gray-200 px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="ابحث: البليدة، تيزي وزو، سطيف..."
            className="flex-1 bg-transparent text-sm font-bold text-gray-800 outline-none placeholder-gray-400"
            dir="rtl"
          />
          {searching && (
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
          {query && !searching && (
            <button type="button" onClick={() => { setQuery(''); setResults([]) }}>
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Search results — rendered via portal so they're never clipped */}
      {results.length > 0 && dropdownRect && createPortal(
        <div
          style={{
            position: 'fixed',
            top: dropdownRect.top,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 99999,
          }}
          className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {results.map((r, i) => (
            <button
              type="button"
              key={i}
              onClick={() => { flyTo(r.lat, r.lon); setQuery(r.display_name.split(',')[0]); setResults([]) }}
              className="w-full text-right px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
            >
              <MapPin size={14} className="text-green-600 flex-shrink-0" />
              <span className="text-sm font-bold text-gray-700 truncate">{r.display_name}</span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* Coordinates bar */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-1.5 flex items-center justify-between z-10 shadow-sm relative">
        <button
          type="button"
          onClick={toggleSatellite}
          className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-600 shadow-sm"
        >
          {satellite ? <MapIcon size={13} /> : <Satellite size={13} />}
          {satellite ? 'خريطة عادية' : 'صور فضائية'}
        </button>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-green-600" />
          <span className="text-green-800 font-bold text-xs" dir="ltr">{pos[0]}° N, {pos[1]}° E</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg text-xs text-gray-800 font-bold pointer-events-none whitespace-nowrap border border-gray-200 z-[1000]">
          اسحب الدبوس أو اضغط لتحديد موقعك
        </div>
      </div>
    </div>,
    document.body
  )
}
