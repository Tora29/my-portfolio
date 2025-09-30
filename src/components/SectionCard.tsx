import { Card, Image, Heading } from './shared'

interface SectionCardProps {
  title: string
  imageSrc: string
  onClick?: () => void
  isCenter?: boolean
}

/**
 * セクションカードコンポーネント
 * セクションのタイトルと背景画像を表示するカード
 *
 * @param {SectionCardProps} props - コンポーネントのプロパティ
 * @param {string} props.title - カードに表示されるタイトル
 * @param {string} props.imageSrc - 背景画像のソースURL
 * @param {() => void} [props.onClick] - カードがクリックされた時のコールバック関数
 * @param {boolean} [props.isCenter=false] - カードが中央に配置されているかどうか（オーバーレイの透明度に影響）
 * @returns {JSX.Element} セクションカードを含むReactコンポーネント
 */
const SectionCard = ({
  title,
  imageSrc,
  onClick,
  isCenter = false,
}: SectionCardProps) => {
  return (
    <Card
      className="w-[280px] sm:w-[340px] md:w-[380px] h-48 sm:h-56 md:h-60 group"
      variant="transparent"
      onClick={onClick}
      padding={false}
      hover
    >
      <Image
        src={imageSrc}
        alt={`${title} section`}
        className="absolute inset-0 w-full h-full object-cover"
        rounded="lg"
        loading="eager"
      />
      <div
        className={`absolute inset-0 rounded-lg group-hover:bg-black/40 transition-colors ${
          isCenter ? 'bg-black/50 md:bg-black/50' : 'bg-black/70 md:bg-black/50'
        }`}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Heading
          as="h3"
          size="large"
          weight="semibold"
          className="text-2xl sm:text-3xl md:text-4xl"
        >
          {title}
        </Heading>
      </div>
    </Card>
  )
}

export default SectionCard
