/**
 * Inline SVG assets for the OwlAuto dashboard.
 * Black-brown gradient body, amber owl eyes — used for both logo and favicon.
 */

export const OWL_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="OwlAuto logo">
  <defs>
    <linearGradient id="owlBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a2618"/>
      <stop offset="55%" stop-color="#1d130c"/>
      <stop offset="100%" stop-color="#0a0604"/>
    </linearGradient>
    <radialGradient id="owlEye" cx="0.5" cy="0.45" r="0.7">
      <stop offset="0%" stop-color="#fde29a"/>
      <stop offset="55%" stop-color="#d4a04c"/>
      <stop offset="100%" stop-color="#6a3f12"/>
    </radialGradient>
    <linearGradient id="owlBeak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e0b061"/>
      <stop offset="100%" stop-color="#7a4a18"/>
    </linearGradient>
  </defs>

  <!-- Ear tufts -->
  <path d="M48 48 L78 22 L82 70 Z" fill="url(#owlBody)"/>
  <path d="M152 48 L122 22 L118 70 Z" fill="url(#owlBody)"/>

  <!-- Head + body silhouette -->
  <ellipse cx="100" cy="112" rx="74" ry="82" fill="url(#owlBody)" stroke="#5a3a22" stroke-width="2.5"/>

  <!-- Subtle feather chest -->
  <path d="M55 150 Q100 175 145 150 Q145 175 100 190 Q55 175 55 150 Z"
        fill="#1a110a" opacity="0.55"/>

  <!-- Eye sockets (dark) -->
  <circle cx="72" cy="100" r="28" fill="#0d0805"/>
  <circle cx="128" cy="100" r="28" fill="#0d0805"/>

  <!-- Glowing amber eyes -->
  <circle cx="72" cy="100" r="22" fill="url(#owlEye)"/>
  <circle cx="128" cy="100" r="22" fill="url(#owlEye)"/>

  <!-- Pupils -->
  <circle cx="72" cy="100" r="7" fill="#0a0604"/>
  <circle cx="128" cy="100" r="7" fill="#0a0604"/>

  <!-- Highlights -->
  <circle cx="76" cy="95" r="3" fill="#fff8e0"/>
  <circle cx="132" cy="95" r="3" fill="#fff8e0"/>

  <!-- Beak -->
  <path d="M100 118 L91 138 L109 138 Z" fill="url(#owlBeak)" stroke="#5a3a18" stroke-width="1"/>
</svg>`;

/** Compact monochrome-ish favicon (32x32-friendly geometry). */
export const OWL_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="fb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a2618"/>
      <stop offset="100%" stop-color="#0a0604"/>
    </linearGradient>
    <radialGradient id="fe" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0%" stop-color="#fde29a"/>
      <stop offset="100%" stop-color="#8a5a1f"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="12" fill="url(#fb)"/>
  <path d="M14 18 L24 10 L26 26 Z" fill="#1d130c"/>
  <path d="M50 18 L40 10 L38 26 Z" fill="#1d130c"/>
  <circle cx="24" cy="34" r="9" fill="url(#fe)"/>
  <circle cx="40" cy="34" r="9" fill="url(#fe)"/>
  <circle cx="24" cy="34" r="2.5" fill="#0a0604"/>
  <circle cx="40" cy="34" r="2.5" fill="#0a0604"/>
  <path d="M32 40 L28 50 L36 50 Z" fill="#d4a04c"/>
</svg>`;
