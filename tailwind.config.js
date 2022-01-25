module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
  theme: {
    extend: {
      borderWidth: {
        '1': '1.5px'
      },
      opacity: {
        'p-default': '0.15',
        'p-hover': '0.25',
        'p-active': '0.55',
        'b-default': '0.7',
        'b-hover': '0.75',
        'b-active': '1',
      },
      colors: {
        lightest: '#f3f3f3',
        highlight: '#c4c4c4',
        active: '#aaa',
        'neutral-light': '#7e7e7e',
        neutral: '#666',
        dark: '#535353',
        back: '#444',
        darker: '#2c2c2c',
        darkest: '#111',
        accept: 'rgb(136, 255, 106)',
        deny: 'rgb(255, 136, 106)',
        'orange-highlight': '#ff9100',
        'red-highlight': '#ff4444',
      }
    },
  },
  variants: ['hover', 'focus', 'active'],
  plugins: [],
}
