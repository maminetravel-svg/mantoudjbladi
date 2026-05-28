import React from 'react'
import { CropType } from '../../types'

// Each icon returns an SVG element sized to fill its container

const Tomato = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="36" r="20" fill="#E53E3E"/>
    <ellipse cx="32" cy="35" rx="20" ry="19" fill="#FC5C5C"/>
    <path d="M32 16 Q28 10 22 12 Q26 14 28 18" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <path d="M32 16 Q36 10 42 12 Q38 14 36 18" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <path d="M32 16 Q30 8 32 5 Q34 8 32 16" fill="#2F855A" stroke="#276749" strokeWidth="0.5"/>
    <ellipse cx="26" cy="28" rx="4" ry="5" fill="#FC8181" fillOpacity="0.5"/>
  </svg>
)

const Potato = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="36" rx="22" ry="15" fill="#C6893F" transform="rotate(-15 32 36)"/>
    <ellipse cx="32" cy="35" rx="21" ry="14" fill="#D4A055" transform="rotate(-15 32 35)"/>
    <circle cx="24" cy="32" r="2.5" fill="#A0642A"/>
    <circle cx="38" cy="38" r="2" fill="#A0642A"/>
    <circle cx="30" cy="42" r="1.5" fill="#A0642A"/>
    <circle cx="40" cy="28" r="2" fill="#A0642A"/>
    <ellipse cx="26" cy="30" rx="5" ry="3" fill="#E0B56B" fillOpacity="0.5" transform="rotate(-15 26 30)"/>
  </svg>
)

const Citrus = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="34" r="20" fill="#DD6B20"/>
    <circle cx="32" cy="34" r="20" fill="#ED8936"/>
    <circle cx="32" cy="34" r="17" fill="#F6AD55"/>
    <line x1="32" y1="17" x2="32" y2="51" stroke="#DD6B20" strokeWidth="1.5"/>
    <line x1="15" y1="34" x2="49" y2="34" stroke="#DD6B20" strokeWidth="1.5"/>
    <line x1="20" y1="22" x2="44" y2="46" stroke="#DD6B20" strokeWidth="1"/>
    <line x1="44" y1="22" x2="20" y2="46" stroke="#DD6B20" strokeWidth="1"/>
    <path d="M32 14 Q30 8 32 6 Q34 8 32 14" fill="#38A169"/>
    <ellipse cx="26" cy="26" rx="3" ry="4" fill="#FBD38D" fillOpacity="0.6"/>
  </svg>
)

const Watermelon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 44 Q32 12 52 44 Z" fill="#38A169"/>
    <path d="M14 44 Q32 15 50 44 Z" fill="#48BB78"/>
    <path d="M16 44 Q32 17 48 44 Z" fill="#FC4646"/>
    <path d="M16 44 Q32 18 48 44 Z" fill="#FC8181"/>
    <path d="M18 44 Q32 20 46 44 Z" fill="#FEB2B2" fillOpacity="0.3"/>
    <circle cx="28" cy="36" r="2" fill="#2D3748"/>
    <circle cx="36" cy="33" r="2" fill="#2D3748"/>
    <circle cx="33" cy="40" r="1.5" fill="#2D3748"/>
    <circle cx="24" cy="40" r="1.5" fill="#2D3748"/>
    <path d="M14 44 Q32 15 50 44" stroke="#276749" strokeWidth="1.5" fill="none"/>
  </svg>
)

const Pepper = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q32 10 30 8 L34 8 Q32 10 32 14" fill="#276749" stroke="#22543D" strokeWidth="0.5"/>
    <path d="M28 14 Q24 12 22 15 Q28 16 32 18" fill="#38A169"/>
    <path d="M32 18 Q42 20 44 30 Q46 40 38 46 Q32 50 26 46 Q18 40 20 30 Q22 20 32 18Z" fill="#38A169"/>
    <path d="M32 18 Q40 21 42 30 Q44 39 37 45 Q32 49 27 45 Q20 39 22 30 Q24 21 32 18Z" fill="#48BB78"/>
    <ellipse cx="29" cy="28" rx="4" ry="7" fill="#68D391" fillOpacity="0.5" transform="rotate(-10 29 28)"/>
  </svg>
)

const Onion = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12 Q30 8 32 6 Q34 8 32 12" fill="#744210" stroke="#5F370E" strokeWidth="0.5"/>
    <ellipse cx="32" cy="38" rx="18" ry="22" fill="#E9D8FD"/>
    <ellipse cx="32" cy="38" rx="18" ry="22" fill="#9F7AEA" fillOpacity="0.3"/>
    <path d="M14 38 Q16 20 32 16 Q48 20 50 38" fill="none" stroke="#B794F4" strokeWidth="1.5"/>
    <path d="M17 42 Q18 28 32 24 Q46 28 47 42" fill="none" stroke="#B794F4" strokeWidth="1.5"/>
    <path d="M16 46 Q18 35 32 32 Q46 35 48 46" fill="none" stroke="#B794F4" strokeWidth="1.5"/>
    <ellipse cx="26" cy="30" rx="5" ry="8" fill="white" fillOpacity="0.2"/>
    <path d="M32 12 L30 16 M32 12 L34 16" stroke="#744210" strokeWidth="1"/>
  </svg>
)

const Wheat = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="55" x2="32" y2="10" stroke="#D69E2E" strokeWidth="2"/>
    {[10,15,20,25,30,35,40].map((y, i) => (
      <g key={i}>
        <ellipse cx={32-8} cy={y+2} rx="7" ry="3.5" fill="#ECC94B" transform={`rotate(-20 ${32-8} ${y+2})`}/>
        <ellipse cx={32+8} cy={y+2} rx="7" ry="3.5" fill="#F6E05E" transform={`rotate(20 ${32+8} ${y+2})`}/>
      </g>
    ))}
    <path d="M20 55 Q32 50 44 55" stroke="#92400E" strokeWidth="1.5" fill="none"/>
  </svg>
)

const Olive = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="34" rx="13" ry="18" fill="#276749"/>
    <ellipse cx="32" cy="34" rx="13" ry="18" fill="#2F855A"/>
    <ellipse cx="32" cy="28" rx="10" ry="13" fill="#38A169"/>
    <circle cx="32" cy="22" r="4" fill="#1A202C"/>
    <ellipse cx="26" cy="30" rx="3" ry="5" fill="#48BB78" fillOpacity="0.4"/>
    <path d="M32 16 Q28 10 24 12" stroke="#276749" strokeWidth="1.5" fill="none"/>
    <path d="M32 16 Q36 10 40 12" stroke="#276749" strokeWidth="1.5" fill="none"/>
  </svg>
)

const Carrot = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 L22 48 Q32 54 42 48 Z" fill="#DD6B20"/>
    <path d="M32 14 L24 46 Q32 51 40 46 Z" fill="#ED8936"/>
    <path d="M32 14 L26 44 Q32 48 38 44 Z" fill="#F6AD55"/>
    <line x1="28" y1="24" x2="22" y2="20" stroke="#ED8936" strokeWidth="1"/>
    <line x1="29" y1="32" x2="21" y2="30" stroke="#ED8936" strokeWidth="1"/>
    <line x1="36" y1="28" x2="42" y2="22" stroke="#ED8936" strokeWidth="1"/>
    <path d="M26 12 Q30 6 32 4 Q34 6 36 4 Q38 6 38 12" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <path d="M29 14 Q28 8 30 6 Q32 8 32 14" fill="#2F855A"/>
    <path d="M35 14 Q36 8 34 6 Q32 8 32 14" fill="#2F855A"/>
  </svg>
)

const Garlic = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 10 32 8 Q34 10 32 14" fill="#744210" stroke="#5F370E" strokeWidth="0.5"/>
    <ellipse cx="32" cy="38" rx="16" ry="18" fill="#FED7AA"/>
    <ellipse cx="32" cy="37" rx="15" ry="17" fill="#FEEBC8"/>
    <path d="M22 34 Q22 24 32 22 Q42 24 42 34 Q42 44 32 46 Q22 44 22 34Z" fill="none" stroke="#D69E2E" strokeWidth="1.5"/>
    <path d="M22 38 Q24 30 32 28 Q40 30 42 38" fill="none" stroke="#D69E2E" strokeWidth="1"/>
    <path d="M24 42 Q26 36 32 34 Q38 36 40 42" fill="none" stroke="#D69E2E" strokeWidth="1"/>
    <line x1="32" y1="22" x2="32" y2="14" stroke="#744210" strokeWidth="1.5"/>
  </svg>
)

const Eggplant = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 10 32 8 Q34 10 32 14" fill="#276749" stroke="#22543D" strokeWidth="0.5"/>
    <path d="M28 14 Q24 12 22 14 Q27 15 32 16" fill="#38A169"/>
    <path d="M36 14 Q40 12 42 14 Q37 15 32 16" fill="#38A169"/>
    <ellipse cx="32" cy="38" rx="16" ry="22" fill="#553C9A"/>
    <ellipse cx="32" cy="36" rx="15" ry="20" fill="#6B46C1"/>
    <ellipse cx="26" cy="28" rx="5" ry="9" fill="#805AD5" fillOpacity="0.5"/>
  </svg>
)

const Zucchini = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 28 Q18 18 28 16 Q38 16 44 22 Q50 30 48 40 Q46 50 36 52 Q26 54 18 48 Q10 42 14 28Z" fill="#276749"/>
    <path d="M15 29 Q19 20 28 18 Q37 18 43 24 Q49 31 47 40 Q45 49 36 51 Q27 53 19 47 Q12 42 15 29Z" fill="#38A169"/>
    <line x1="20" y1="22" x2="46" y2="46" stroke="#276749" strokeWidth="1.5"/>
    <line x1="20" y1="30" x2="46" y2="40" stroke="#276749" strokeWidth="1.5"/>
    <line x1="22" y1="38" x2="44" y2="36" stroke="#276749" strokeWidth="1"/>
    <ellipse cx="22" cy="52" rx="5" ry="3" fill="#F6AD55" transform="rotate(-30 22 52)"/>
  </svg>
)

const Cucumber = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="34" rx="13" ry="22" fill="#276749" transform="rotate(-20 32 34)"/>
    <ellipse cx="32" cy="34" rx="11" ry="20" fill="#38A169" transform="rotate(-20 32 34)"/>
    <line x1="22" y1="18" x2="42" y2="50" stroke="#276749" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="26" cy="24" r="1.5" fill="#276749"/>
    <circle cx="30" cy="30" r="1.5" fill="#276749"/>
    <circle cx="34" cy="36" r="1.5" fill="#276749"/>
    <circle cx="38" cy="42" r="1.5" fill="#276749"/>
    <path d="M16 18 Q20 14 24 16" fill="none" stroke="#38A169" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const Lettuce = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="38" rx="22" ry="16" fill="#276749"/>
    <ellipse cx="32" cy="36" rx="20" ry="14" fill="#38A169"/>
    <path d="M12 36 Q18 24 32 22 Q46 24 52 36" fill="#48BB78"/>
    <path d="M16 40 Q22 28 32 26 Q42 28 48 40" fill="#68D391"/>
    <path d="M20 44 Q26 34 32 32 Q38 34 44 44" fill="#9AE6B4"/>
    <ellipse cx="32" cy="36" rx="8" ry="6" fill="#C6F6D5"/>
  </svg>
)

const Fig = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 10 32 8 Q34 10 32 14" fill="#744210" stroke="#5F370E" strokeWidth="0.5"/>
    <path d="M28 15 Q24 10 20 14 Q26 16 32 16" fill="#276749"/>
    <ellipse cx="32" cy="38" rx="16" ry="22" fill="#6B46C1"/>
    <ellipse cx="32" cy="36" rx="15" ry="20" fill="#805AD5"/>
    <ellipse cx="32" cy="34" rx="12" ry="17" fill="#9F7AEA" fillOpacity="0.5"/>
    <ellipse cx="26" cy="28" rx="4" ry="7" fill="#B794F4" fillOpacity="0.4"/>
    <ellipse cx="32" cy="50" rx="4" ry="2.5" fill="#553C9A"/>
  </svg>
)

const Grape = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="8" x2="32" y2="16" stroke="#744210" strokeWidth="2"/>
    <path d="M32 12 Q40 8 44 12" fill="none" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="24" cy="22" r="6" fill="#6B46C1"/>
    <circle cx="36" cy="22" r="6" fill="#553C9A"/>
    <circle cx="18" cy="32" r="6" fill="#553C9A"/>
    <circle cx="30" cy="32" r="6" fill="#6B46C1"/>
    <circle cx="42" cy="32" r="6" fill="#553C9A"/>
    <circle cx="24" cy="42" r="6" fill="#6B46C1"/>
    <circle cx="36" cy="42" r="6" fill="#553C9A"/>
    <circle cx="30" cy="52" r="6" fill="#6B46C1"/>
    {[24,36,18,30,42,24,36,30].map((cx, i) => {
      const cy = [22,22,32,32,32,42,42,52][i]
      return <ellipse key={i} cx={cx-2} cy={cy-2} rx="2" ry="1.5" fill="white" fillOpacity="0.3"/>
    })}
  </svg>
)

const Apricot = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 10 32 8 Q34 10 32 14" fill="#744210" stroke="#5F370E" strokeWidth="0.5"/>
    <path d="M28 14 Q24 10 26 14" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <circle cx="32" cy="36" r="20" fill="#DD6B20"/>
    <circle cx="32" cy="35" r="19" fill="#ED8936"/>
    <path d="M32 16 Q44 24 44 36 Q44 44 38 48" fill="none" stroke="#C05621" strokeWidth="1.5"/>
    <ellipse cx="26" cy="28" rx="5" ry="7" fill="#FBD38D" fillOpacity="0.4"/>
    <ellipse cx="32" cy="36" rx="4" ry="20" fill="#C05621" fillOpacity="0.15"/>
  </svg>
)

const Peach = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 10 32 8 Q34 10 32 14" fill="#744210" stroke="#5F370E" strokeWidth="0.5"/>
    <path d="M28 14 Q24 10 22 13 Q27 14 32 14" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <circle cx="32" cy="36" r="20" fill="#FC8181"/>
    <circle cx="32" cy="35" r="19" fill="#FEB2B2"/>
    <path d="M26 16 Q18 26 20 38" fill="none" stroke="#FC4646" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="26" cy="26" rx="5" ry="7" fill="white" fillOpacity="0.3"/>
    <ellipse cx="32" cy="36" rx="3" ry="18" fill="#FC4646" fillOpacity="0.1"/>
  </svg>
)

const Apple = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 8 32 6 Q34 8 32 14" fill="#744210" stroke="#5F370E" strokeWidth="0.5"/>
    <path d="M32 10 Q38 6 42 10" fill="none" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 32 Q12 16 24 14 Q32 12 32 18 Q32 12 40 14 Q52 16 52 32 Q52 50 38 54 Q34 56 32 54 Q30 56 26 54 Q12 50 12 32Z" fill="#E53E3E"/>
    <path d="M14 32 Q14 18 25 16 Q32 14 32 18 Q32 14 39 16 Q50 18 50 32 Q50 49 37 53 Q34 55 32 53 Q30 55 27 53 Q14 49 14 32Z" fill="#FC5C5C"/>
    <ellipse cx="24" cy="26" rx="5" ry="7" fill="white" fillOpacity="0.3"/>
  </svg>
)

const Dates = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="10" x2="32" y2="56" stroke="#744210" strokeWidth="2.5"/>
    {[-20,-10,0,10,20].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 32 56)`}>
        <path d={`M32 ${20+i*2} Q${32+15} ${15+i*2} ${32+20} ${22+i*2}`} fill="#38A169" stroke="#276749" strokeWidth="1"/>
      </g>
    ))}
    <ellipse cx="28" cy="44" rx="5" ry="7" fill="#C05621" transform="rotate(-10 28 44)"/>
    <ellipse cx="36" cy="42" rx="5" ry="7" fill="#DD6B20" transform="rotate(10 36 42)"/>
    <ellipse cx="32" cy="40" rx="4" ry="6" fill="#ED8936"/>
  </svg>
)

const Corn = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 50 Q22 20 32 12 Q42 20 42 50 Q36 54 32 54 Q28 54 22 50Z" fill="#ECC94B"/>
    <path d="M24 50 Q24 22 32 14 Q40 22 40 50 Q36 53 32 53 Q28 53 24 50Z" fill="#F6E05E"/>
    {[18,22,26,30,34,38,42,46].map((y) => (
      <g key={y}>
        <ellipse cx="27" cy={y} rx="4" ry="2.5" fill="#D69E2E"/>
        <ellipse cx="32" cy={y-1} rx="4" ry="2.5" fill="#ECC94B"/>
        <ellipse cx="37" cy={y} rx="4" ry="2.5" fill="#D69E2E"/>
      </g>
    ))}
    <path d="M22 28 Q16 24 14 18" fill="none" stroke="#38A169" strokeWidth="2" strokeLinecap="round"/>
    <path d="M42 24 Q48 20 50 14" fill="none" stroke="#38A169" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 12 L30 8 M32 12 L34 8" stroke="#ECC94B" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const Barley = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="56" x2="32" y2="10" stroke="#92400E" strokeWidth="2"/>
    {[10,16,22,28,34,40].map((y, i) => (
      <g key={i}>
        <ellipse cx={32-10} cy={y+2} rx="8" ry="2.5" fill="#D69E2E" transform={`rotate(-25 ${32-10} ${y+2})`}/>
        <ellipse cx={32+10} cy={y+2} rx="8" ry="2.5" fill="#ECC94B" transform={`rotate(25 ${32+10} ${y+2})`}/>
        <line x1={32-10} y1={y+2} x2={32} y2={y} stroke="#92400E" strokeWidth="1"/>
        <line x1={32+10} y1={y+2} x2={32} y2={y} stroke="#92400E" strokeWidth="1"/>
      </g>
    ))}
    <path d="M20 56 Q32 52 44 56" stroke="#744210" strokeWidth="1.5" fill="none"/>
  </svg>
)

const Pumpkin = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 14 Q30 10 32 8 Q34 10 32 14" fill="#276749" stroke="#22543D" strokeWidth="0.5"/>
    <path d="M32 14 Q30 12 28 14" fill="#38A169"/>
    <ellipse cx="32" cy="38" rx="22" ry="18" fill="#DD6B20"/>
    <ellipse cx="22" cy="38" rx="8" ry="16" fill="#ED8936"/>
    <ellipse cx="32" cy="38" rx="8" ry="18" fill="#F6AD55"/>
    <ellipse cx="42" cy="38" rx="8" ry="16" fill="#ED8936"/>
    <line x1="22" y1="22" x2="22" y2="54" stroke="#C05621" strokeWidth="1"/>
    <line x1="32" y1="20" x2="32" y2="56" stroke="#C05621" strokeWidth="1"/>
    <line x1="42" y1="22" x2="42" y2="54" stroke="#C05621" strokeWidth="1"/>
    <ellipse cx="26" cy="30" rx="5" ry="4" fill="#FBD38D" fillOpacity="0.4"/>
  </svg>
)

const Beans = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="30" rx="9" ry="12" fill="#38A169" transform="rotate(-20 24 30)"/>
    <ellipse cx="40" cy="34" rx="9" ry="12" fill="#2F855A" transform="rotate(20 40 34)"/>
    <ellipse cx="24" cy="29" rx="7" ry="10" fill="#48BB78" transform="rotate(-20 24 29)"/>
    <ellipse cx="40" cy="33" rx="7" ry="10" fill="#38A169" transform="rotate(20 40 33)"/>
    <ellipse cx="22" cy="26" rx="2" ry="3" fill="#68D391" fillOpacity="0.5" transform="rotate(-20 22 26)"/>
    <ellipse cx="38" cy="30" rx="2" ry="3" fill="#68D391" fillOpacity="0.5" transform="rotate(20 38 30)"/>
  </svg>
)

const Lentils = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[
      [20,20], [36,18], [28,28], [44,26], [16,34], [32,36], [48,32], [24,44], [40,42]
    ].map(([cx, cy], i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="8" ry="5" fill={i % 2 === 0 ? '#92400E' : '#A0522D'}/>
        <ellipse cx={cx} cy={cy} rx="6" ry="3.5" fill={i % 2 === 0 ? '#C05621' : '#B7791F'}/>
      </g>
    ))}
  </svg>
)

const Chickpeas = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[
      [22,24],[42,22],[16,38],[32,32],[48,36],[26,48],[44,48]
    ].map(([cx, cy], i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="9" ry="8" fill={i % 2 === 0 ? '#D69E2E' : '#B7791F'}/>
        <ellipse cx={cx} cy={cy} rx="7" ry="6" fill={i % 2 === 0 ? '#ECC94B' : '#D69E2E'}/>
        <circle cx={cx+2} cy={cy-1} r="2" fill="#F6E05E" fillOpacity="0.5"/>
      </g>
    ))}
  </svg>
)

const Sunflower = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="56" x2="32" y2="28" stroke="#276749" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 45 Q28 42 32 48" fill="none" stroke="#38A169" strokeWidth="2" strokeLinecap="round"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => {
      const rad = (deg * Math.PI) / 180
      const x1 = 32 + 12 * Math.cos(rad)
      const y1 = 22 + 12 * Math.sin(rad)
      const x2 = 32 + 20 * Math.cos(rad)
      const y2 = 22 + 20 * Math.sin(rad)
      return <ellipse key={deg} cx={(x1+x2)/2} cy={(y1+y2)/2} rx="5" ry="3" fill="#ECC94B" transform={`rotate(${deg} ${(x1+x2)/2} ${(y1+y2)/2})`}/>
    })}
    <circle cx="32" cy="22" r="11" fill="#92400E"/>
    <circle cx="32" cy="22" r="9" fill="#744210"/>
    {[0,45,90,135,180,225,270,315].map((deg) => {
      const rad = (deg * Math.PI) / 180
      return <circle key={deg} cx={32 + 6 * Math.cos(rad)} cy={22 + 6 * Math.sin(rad)} r="1.5" fill="#1A202C"/>
    })}
    <circle cx="32" cy="22" r="3" fill="#2D3748"/>
  </svg>
)

const Strawberry = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 16 Q22 10 26 10 Q30 10 32 14" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <path d="M40 16 Q42 10 38 10 Q34 10 32 14" fill="#38A169" stroke="#276749" strokeWidth="0.5"/>
    <path d="M32 14 Q30 8 32 6 Q34 8 32 14" fill="#38A169"/>
    <path d="M12 24 Q14 14 24 14 Q28 12 32 14 Q36 12 40 14 Q50 14 52 24 Q56 36 44 48 Q38 54 32 56 Q26 54 20 48 Q8 36 12 24Z" fill="#E53E3E"/>
    <path d="M14 24 Q16 16 24 16 Q28 14 32 16 Q36 14 40 16 Q48 16 50 24 Q54 35 43 47 Q38 52 32 54 Q26 52 21 47 Q10 35 14 24Z" fill="#FC5C5C"/>
    <circle cx="24" cy="28" r="2" fill="#FEB2B2"/>
    <circle cx="36" cy="24" r="2" fill="#FEB2B2"/>
    <circle cx="30" cy="36" r="2" fill="#FEB2B2"/>
    <circle cx="42" cy="34" r="2" fill="#FEB2B2"/>
    <circle cx="20" cy="38" r="1.5" fill="#FEB2B2"/>
    <circle cx="34" cy="46" r="1.5" fill="#FEB2B2"/>
    <ellipse cx="24" cy="24" rx="4" ry="5" fill="white" fillOpacity="0.25"/>
  </svg>
)

const Fennel = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="40" rx="14" ry="16" fill="#F0FFF4"/>
    <ellipse cx="32" cy="40" rx="12" ry="14" fill="#C6F6D5"/>
    <path d="M26 26 Q32 10 38 26" fill="none" stroke="#68D391" strokeWidth="3"/>
    <path d="M22 30 Q28 15 32 30" fill="none" stroke="#48BB78" strokeWidth="2"/>
    <path d="M42 30 Q36 15 32 30" fill="none" stroke="#48BB78" strokeWidth="2"/>
  </svg>
)

const Banana = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 48 Q32 60 48 40 Q40 50 20 44 Z" fill="#ECC94B"/>
    <path d="M16 48 Q20 30 46 36 Q38 46 20 44 Z" fill="#F6E05E"/>
    <path d="M46 36 Q50 34 52 38" fill="none" stroke="#92400E" strokeWidth="2"/>
    <circle cx="16" cy="48" r="2" fill="#744210"/>
  </svg>
)

const Cherry = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="44" r="10" fill="#E53E3E"/>
    <circle cx="42" cy="44" r="10" fill="#C53030"/>
    <path d="M22 34 Q32 14 36 20" fill="none" stroke="#38A169" strokeWidth="2"/>
    <path d="M42 34 Q36 14 36 20" fill="none" stroke="#2F855A" strokeWidth="2"/>
    <path d="M36 20 Q44 14 50 16 Q42 18 36 20" fill="#48BB78"/>
    <ellipse cx="20" cy="42" rx="3" ry="5" fill="white" fillOpacity="0.4" transform="rotate(-30 20 42)"/>
    <ellipse cx="40" cy="42" rx="3" ry="5" fill="white" fillOpacity="0.3" transform="rotate(-30 40 42)"/>
  </svg>
)

const Kiwi = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="18" fill="#744210"/>
    <circle cx="32" cy="32" r="16" fill="#48BB78"/>
    <circle cx="32" cy="32" r="6" fill="#F0FFF4"/>
    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
      <circle key={deg} cx={32 + 9 * Math.cos(deg * Math.PI / 180)} cy={32 + 9 * Math.sin(deg * Math.PI / 180)} r="1.5" fill="#1A202C"/>
    ))}
  </svg>
)

const Raspberry = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 20 Q32 12 40 20 Q48 36 32 50 Q16 36 24 20" fill="#D53F8C"/>
    {[
      [28,24],[36,24],[24,30],[32,30],[40,30],[28,36],[36,36],[32,42]
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="3" fill="#B83280"/>
    ))}
    {[
      [28,24],[36,24],[24,30],[32,30],[40,30],[28,36],[36,36],[32,42]
    ].map(([cx, cy], i) => (
      <ellipse key={i} cx={cx - 1} cy={cy - 1} rx="1" ry="0.5" fill="white" fillOpacity="0.4" transform={`rotate(-30 ${cx-1} ${cy-1})`}/>
    ))}
    <path d="M24 18 Q32 24 40 18 Q36 10 32 14 Q28 10 24 18" fill="#38A169"/>
  </svg>
)

// Map crop type → SVG component + background color
export const CROP_SVG_ICONS: Record<CropType, { component: React.FC; bg: string }> = {
  tomato:     { component: Tomato,     bg: '#FFF5F5' },
  potato:     { component: Potato,     bg: '#FFFBEB' },
  citrus:     { component: Citrus,     bg: '#FFFBEB' },
  watermelon: { component: Watermelon, bg: '#F0FFF4' },
  pepper:     { component: Pepper,     bg: '#F0FFF4' },
  onion:      { component: Onion,      bg: '#FAF5FF' },
  wheat:      { component: Wheat,      bg: '#FFFBEB' },
  olive:      { component: Olive,      bg: '#F0FFF4' },
  carrot:     { component: Carrot,     bg: '#FFFBEB' },
  garlic:     { component: Garlic,     bg: '#FFFFF0' },
  eggplant:   { component: Eggplant,   bg: '#FAF5FF' },
  zucchini:   { component: Zucchini,   bg: '#F0FFF4' },
  cucumber:   { component: Cucumber,   bg: '#F0FFF4' },
  lettuce:    { component: Lettuce,    bg: '#F0FFF4' },
  fig:        { component: Fig,        bg: '#FAF5FF' },
  grape:      { component: Grape,      bg: '#FAF5FF' },
  apricot:    { component: Apricot,    bg: '#FFFBEB' },
  peach:      { component: Peach,      bg: '#FFF5F5' },
  apple:      { component: Apple,      bg: '#FFF5F5' },
  dates:      { component: Dates,      bg: '#FFFBEB' },
  corn:       { component: Corn,       bg: '#FFFFF0' },
  barley:     { component: Barley,     bg: '#FFFBEB' },
  pumpkin:    { component: Pumpkin,    bg: '#FFFBEB' },
  beans:      { component: Beans,      bg: '#F0FFF4' },
  lentils:    { component: Lentils,    bg: '#FFFBEB' },
  chickpeas:  { component: Chickpeas,  bg: '#FFFBEB' },
  sunflower:  { component: Sunflower,  bg: '#FFFFF0' },
  strawberry: { component: Strawberry, bg: '#FFF5F5' },
  fennel:     { component: Fennel,     bg: '#F0FFF4' },
  banana:     { component: Banana,     bg: '#FFFFF0' },
  cherry:     { component: Cherry,     bg: '#FFF5F5' },
  kiwi:       { component: Kiwi,       bg: '#F0FFF4' },
  raspberry:  { component: Raspberry,  bg: '#FFF5F5' },
}
