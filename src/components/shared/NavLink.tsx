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

/**
 * ナビゲーションリンクコンポーネント
 * ページ内スクロール、外部リンク、カスタムクリックハンドラーをサポート
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.to - リンク先URL。'#'で始まる場合はページ内アンカーとして扱われる
 * @param {React.ReactNode} props.children - リンク内に表示する子要素
 * @param {Function} props.onClick - クリック時に実行されるコールバック関数
 * @param {ScrollBehavior} props.scrollBehavior - スクロールの動作 ('smooth' または 'auto')
 * @param {number} props.scrollOffset - スクロール位置のオフセット値 (ピクセル)
 * @param {boolean} props.external - trueの場合、外部リンクとして扱い新しいタブで開く
 * @param {string} props.className - 追加のCSSクラス名
 * @param {Record<string, unknown>} props.buttonProps - Buttonコンポーネントに渡す追加のプロパティ
 * @returns {JSX.Element} ナビゲーションリンク要素
 */
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
  /**
   * リンククリック時のハンドラー
   * ページ内アンカーの場合はスムーススクロールを実行
   *
   * @param {MouseEvent<HTMLButtonElement | HTMLAnchorElement>} e - クリックイベントオブジェクト
   * @returns {void}
   */
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
