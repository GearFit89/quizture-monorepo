import { IconKey, Icons } from '@/lib/icons'

interface IconProps {
  name: IconKey;
  color?: string;
  size?: number;
  children?: React.ReactNode
}
export default function Icon ({ name, color, size, children } : IconProps) {
  const IconComponent = Icons[name]

  if (!IconComponent) {
    console.error('[icon] failed to get icon: ', name)
    return null
  }

  return (

    <IconComponent size={size} color={color}>

      {children}

    </IconComponent>

  )
}
