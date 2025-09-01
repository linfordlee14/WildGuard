module.exports = { 
   content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], 
   theme: { 
     extend: { 
       colors: { 
         'wg-forest': '#0b6b4f', 
         'wg-sand':   '#f3e9dc', 
         'wg-accent': '#ff8a3d', 
         'wg-deep':   '#08363a', 
         'wg-muted':  '#6b7280', 
       }, 
       fontFamily: { 
         sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
       }, 
       borderRadius: { 
         xl: '1rem', 
       }, 
     }, 
   }, 
   plugins: [], 
 };