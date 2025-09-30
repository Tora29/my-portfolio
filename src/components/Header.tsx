import { useState } from 'react'
import { Github, Menu } from 'lucide-react'
import { IconButton, NavLink, Button, Heading } from './shared'
import { NAV_ITEMS, SOCIAL_LINKS, ICON_MAP } from '../config/constants'
import useScrollTo from '../hooks/useScrollTo'

/**
 * ヘッダーコンポーネント
 * サイトのナビゲーションバーを表示し、デスクトップとモバイルの両方に対応する
 *
 * @returns {JSX.Element} ヘッダーを含むReactコンポーネント
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollToElement } = useScrollTo()

  /**
   * ナビゲーションアイテムのクリックハンドラー
   * モバイルメニューを閉じて指定されたセクションにスクロールする
   *
   * @param {string} sectionId - スクロール先のセクションID
   * @returns {void}
   */
  const handleNavClick = (sectionId: string): void => {
    setIsMenuOpen(false)
    scrollToElement(sectionId)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[rgb(23,24,32)]/60 backdrop-blur-md border-b border-[rgb(199,195,187)]/10 px-4 md:px-20 py-3">
      <div className="flex justify-between items-center">
        <Heading as="div" size="large" font="rubik">
          <span className="text-[rgb(199,195,187)]">Tora</span>
          <span className="text-[rgb(108,95,62)]">29</span>
        </Heading>

        <nav className="hidden md:flex justify-start items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={`#${item.id}`}
              onClick={() => handleNavClick(item.id)}
              buttonProps={{ size: 'nav', variant: 'primary' }}
            >
              <IconButton
                icon={ICON_MAP[item.id]}
                label={item.label}
                buttonProps={{ size: 'nav', variant: 'primary' }}
              />
            </NavLink>
          ))}
          <NavLink
            to={SOCIAL_LINKS.github}
            external
            buttonProps={{ size: 'nav', variant: 'primary' }}
          >
            <IconButton
              icon={Github}
              label="GitHub"
              buttonProps={{ size: 'nav', variant: 'primary' }}
            />
          </NavLink>
        </nav>

        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
          variant="ghost"
          size="icon"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[rgb(23,24,32)]/95 backdrop-blur-md border-t border-[rgb(199,195,187)]/20 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={`#${item.id}`}
              onClick={() => handleNavClick(item.id)}
              buttonProps={{
                variant: 'ghost',
                fullWidth: true,
                className:
                  'text-left px-8 py-3 rounded-none hover:bg-[rgb(108,95,62)]',
              }}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={SOCIAL_LINKS.github}
            external
            buttonProps={{
              variant: 'ghost',
              fullWidth: true,
              className:
                'text-left px-8 py-3 rounded-none hover:bg-[rgb(108,95,62)]',
            }}
          >
            GitHub
          </NavLink>
        </div>
      )}
    </header>
  )
}

export default Header
