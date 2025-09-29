import { HTMLAttributes } from 'react'

type DividerOrientation = 'horizontal' | 'vertical'
type DividerSpacing = 'none' | 'tight' | 'normal' | 'loose'

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation
  thickness?: string
  color?: string
  opacity?: number
  spacing?: DividerSpacing
  className?: string
}

const Divider = ({
  orientation = 'horizontal',
  thickness = '1px',
  color = 'rgb(199,195,187)',
  opacity = 1,
  spacing = 'normal',
  className = '',
  ...props
}: DividerProps) => {
  const spacingClasses: Record<DividerSpacing, string> = {
    none: '',
    tight: orientation === 'horizontal' ? 'my-1' : 'mx-1',
    normal: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    loose: orientation === 'horizontal' ? 'my-4' : 'mx-4',
  }

  const orientationClasses: Record<DividerOrientation, string> = {
    horizontal: 'w-full',
    vertical: 'h-full self-center',
  }

  const sizeStyle =
    orientation === 'horizontal' ? { height: thickness } : { width: thickness }

  const combinedClasses = `
    ${orientationClasses[orientation]}
    ${spacingClasses[spacing]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <div
      className={combinedClasses}
      style={{
        ...sizeStyle,
        backgroundColor: color,
        opacity,
      }}
      {...props}
    />
  )
}

export default Divider
