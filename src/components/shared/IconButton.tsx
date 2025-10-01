import React from 'react'
import { IconType } from 'react-icons'

type IconDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse'
type IconSpacing = 'none' | 'tight' | 'normal' | 'loose'

interface IconButtonProps {
  icon?: IconType
  label?: string
  direction?: IconDirection
  iconSize?: number
  spacing?: IconSpacing
  className?: string
  [key: string]: unknown
}

const IconButton = React.memo(
  ({
    icon: Icon,
    label,
    direction = 'column',
    iconSize = 20,
    spacing = 'normal',
    className = '',
    ...props
  }: IconButtonProps) => {
    const directionClasses: Record<IconDirection, string> = {
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
    }

    const spacingClasses: Record<IconSpacing, string> = {
      none: '',
      tight: direction.includes('column') ? 'gap-0.5' : 'gap-1',
      normal: direction.includes('column') ? 'gap-1' : 'gap-2',
      loose: direction.includes('column') ? 'gap-2' : 'gap-3',
    }

    const contentClasses = `
    flex items-center justify-center
    ${directionClasses[direction]}
    ${spacingClasses[spacing]}
    ${className}
  `
      .replace(/\s+/g, ' ')
      .trim()

    return (
      <div className={contentClasses} {...props}>
        {Icon && (
          <Icon
            className="text-[rgb(199,195,187)]"
            style={{ width: iconSize, height: iconSize }}
          />
        )}
        {label && (
          <span className="text-[rgb(199,195,187)] text-xs font-normal font-['Rubik'] leading-tight">
            {label}
          </span>
        )}
      </div>
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
