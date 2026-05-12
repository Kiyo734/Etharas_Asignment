const colors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316','#6366f1']

function getColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return colors[Math.abs(h) % colors.length]
}

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const sizes = { xs: 22, sm: 26, md: 30, lg: 36, xl: 44 }
const fontSizes = { xs: 9, sm: 10, md: 11, lg: 13, xl: 15 }

export default function Avatar({ name = '', size = 'md', style = {} }) {
  const px = sizes[size] || 30
  const fs = fontSizes[size] || 11

  return (
    <div
      className="avatar"
      title={name}
      style={{
        width: px, height: px,
        background: getColor(name),
        color: '#fff',
        fontSize: fs,
        flexShrink: 0,
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  )
}
