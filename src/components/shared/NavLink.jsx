import React from 'react'
import Button from './Button'

const NavLink = ({
  to,
  children,
  onClick,
  scrollBehavior = 'smooth',
  scrollOffset = 0,
  external = false,
  className = '',
  buttonProps = {},
  ...props
}) => {
  const handleClick = (e) => {
    if (external) {
      return
    }

    e.preventDefault()

    if (to && to.startsWith('#')) {
      const elementId = to.replace('#', '')
      const element = document.getElementById(elementId)

      if (element) {
        const offsetTop = element.offsetTop - scrollOffset
        window.scrollTo({
          top: offsetTop,
          behavior: scrollBehavior,
        })
      }
    }

    if (onClick) {
      onClick(e)
    }
  }

  const isAnchor = external || (to && !to.startsWith('#'))

  return (
    <Button
      as={isAnchor ? 'a' : 'button'}
      href={isAnchor ? to : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={className}
      {...buttonProps}
      {...props}
    >
      {children}
    </Button>
  )
}

export default NavLink
