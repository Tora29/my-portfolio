import React from 'react'
import { NavLink, Divider, Text } from './shared'
import { NAV_ITEMS } from '../config/constants'

const Footer = () => {
  const footerLinks = NAV_ITEMS

  return (
    <footer className="w-full h-auto sm:h-48 bg-[rgb(23,24,32)] overflow-hidden py-6 sm:py-0">
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.id}>
              <NavLink
                to={`#${link.id}`}
                buttonProps={{
                  variant: 'ghost',
                  className: 'px-4 sm:px-6 md:px-8 hover:text-[rgb(108,95,62)]',
                }}
              >
                <Text size="lg" className="text-base sm:text-lg md:text-xl">
                  {link.label}
                </Text>
              </NavLink>
              {index < footerLinks.length - 1 && (
                <Divider
                  orientation="vertical"
                  className="h-8 hidden sm:block"
                  spacing="none"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
