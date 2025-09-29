import React from 'react'
import Button from './Button'

const IconButton = React.memo(
  ({
    icon: Icon,
    label,
    direction = 'column',
    iconSize = 20,
    spacing = 'normal',
    onClick,
    className = '',
    buttonProps = {},
    ...props
  }) => {
    const directionClasses = {
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
    }

    const spacingClasses = {
      none: '',
      tight: direction.includes('column') ? 'gap-0.5' : 'gap-1',
      normal: direction.includes('column') ? 'gap-1' : 'gap-2',
      loose: direction.includes('column') ? 'gap-2' : 'gap-3',
    }

    const contentClasses = `
    flex items-center justify-center
    ${directionClasses[direction]}
    ${spacingClasses[spacing]}
  `
      .replace(/\s+/g, ' ')
      .trim()

    return (
      <Button
        onClick={onClick}
        className={className}
        {...buttonProps}
        {...props}
      >
        <div className={contentClasses}>
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
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
