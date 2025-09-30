import React from 'react'
import { NavLink, Divider, Text } from './shared'
import { NAV_ITEMS } from '../config/constants'

/**
 * フッターコンポーネント
 * ナビゲーションリンクと著作権情報を表示する
 *
 * @returns {JSX.Element} フッターを含むReactコンポーネント
 */
const Footer = () => {
  const footerLinks = NAV_ITEMS

  return (
    <footer className="w-full h-auto sm:h-48 bg-[rgb(23,24,32)] border-t border-gray-800 overflow-hidden py-8 sm:py-0">
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-0">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.id}>
              <NavLink
                to={`#${link.id}`}
                buttonProps={{
                  variant: 'ghost',
                  className:
                    'px-6 sm:px-6 md:px-8 py-2 hover:text-[rgb(108,95,62)] w-full sm:w-auto',
                }}
              >
                <Text
                  size="lg"
                  className="text-lg sm:text-lg md:text-xl font-medium"
                >
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
        <Text className="text-sm">© 2025 Tora29</Text>
      </div>
    </footer>
  )
}

export default Footer
