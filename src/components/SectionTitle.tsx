import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Heading } from './shared'

interface SectionTitleProps {
  title: string
}

/**
 * セクションタイトルコンポーネント
 * セクションのタイトルと装飾的なアンダーラインを表示し、スクロールアニメーションを適用する
 *
 * @param {SectionTitleProps} props - コンポーネントのプロパティ
 * @param {string} props.title - 表示するセクションタイトル
 * @returns {JSX.Element} セクションタイトルを含むReactコンポーネント
 */
const SectionTitle = ({ title }: SectionTitleProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 })

  return (
    <div
      ref={ref}
      className={`w-80 mx-auto mb-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <Heading
        as="h2"
        size="xlarge"
        font="rubik"
        weight="medium"
        color="primary"
        className="text-center mb-3"
      >
        {title}
      </Heading>
      <div
        className={`w-48 h-0 mx-auto border border-[rgb(199,195,187)] transition-all duration-1000 delay-300 ${
          isVisible ? 'scale-x-100' : 'scale-x-0'
        }`}
      ></div>
    </div>
  )
}

export default SectionTitle
