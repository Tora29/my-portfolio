import React, { MouseEvent } from 'react'
import Button from './Button'

interface NavLinkProps {
  to?: string
  children?: React.ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  scrollBehavior?: ScrollBehavior
  scrollOffset?: number
  external?: boolean
  className?: string
  buttonProps?: Record<string, unknown>
  [key: string]: unknown
}

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
}: NavLinkProps) => {
  const handleClick = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ): void => {
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

  if (isAnchor) {
    return (
      <Button
        as="a"
        href={to}
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

  return (
    <Button
      as="button"
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
