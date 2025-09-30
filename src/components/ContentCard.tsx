import { useState } from 'react'
import { Card, Image, Heading, Text, Modal } from './shared'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SkillCategory, TimelineItem } from '../config/constants'
import CircularProgress from './CircularProgress'
import Timeline from './Timeline'

interface ContentCardProps {
  title: string
  summary: string
  content: string
  imageSrc: string
  imagePosition?: string
  skills?: SkillCategory[]
  timeline?: TimelineItem[]
}

/**
 * コンテンツカードコンポーネント
 * スキル情報やタイムライン情報を含むカードを表示し、クリックするとモーダルで詳細を表示する
 *
 * @param {ContentCardProps} props - コンポーネントのプロパティ
 * @param {string} props.title - カードのタイトル
 * @param {string} props.summary - カードの概要テキスト
 * @param {string} props.content - モーダルに表示される詳細コンテンツ
 * @param {string} props.imageSrc - カードに表示される画像のソースURL
 * @param {string} [props.imagePosition] - 画像の表示位置を調整するCSSクラス
 * @param {SkillCategory[]} [props.skills] - スキルカテゴリーの配列（モーダルにスキルを表示する場合）
 * @param {TimelineItem[]} [props.timeline] - タイムラインアイテムの配列（モーダルにタイムラインを表示する場合）
 * @returns {JSX.Element} コンテンツカードとモーダルを含むReactコンポーネント
 */
const ContentCard = ({
  title,
  summary,
  content,
  imageSrc,
  imagePosition,
  skills,
  timeline,
}: ContentCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        ref={ref}
        className={`w-full max-w-[90vw] sm:max-w-[650px] md:max-w-[800px] lg:max-w-[950px] transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
      >
        <Card
          className="w-full h-auto lg:h-[280px] flex flex-col lg:flex-row cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(108,95,62,0.3)] relative group"
          padding={false}
          rounded="lg"
          overflow="hidden"
          onClick={() => setIsModalOpen(true)}
        >
          {/* キラッと光るエフェクト */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full group-hover:duration-700 duration-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />
          {/* 画像エリア */}
          <div className="w-full lg:w-[230px] h-[190px] lg:h-[280px] relative flex-shrink-0">
            <Image
              src={imageSrc}
              alt={title}
              placeholder="https://placehold.co/250x300"
              className={`w-full h-full object-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg ${imagePosition || ''}`}
            />
          </div>

          {/* コンテンツエリア */}
          <div className="flex-1 p-4 sm:p-6 md:p-7 flex flex-col justify-between">
            <div>
              <Heading
                as="h3"
                size="large"
                className="mb-2 md:mb-3 text-xl sm:text-2xl md:text-3xl"
              >
                {title}
              </Heading>

              <Text
                size="lg"
                weight="light"
                className="leading-6 sm:leading-7 text-sm sm:text-base md:text-lg line-clamp-3"
              >
                {summary}
              </Text>
            </div>

            {/* Read more リンク */}
            <div className="flex justify-end mt-3">
              <span className="text-[rgb(199,195,187)] group-hover:text-white underline text-base sm:text-lg transition-colors">
                Read more →
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* モーダル */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <Heading
            as="h2"
            size="xlarge"
            className="mb-6 text-2xl sm:text-3xl md:text-4xl"
          >
            {title}
          </Heading>

          {skills ? (
            <div className="space-y-8">
              {skills.map((skillCategory, index) => (
                <div key={index}>
                  <Heading
                    as="h3"
                    size="large"
                    className="mb-4 text-lg sm:text-xl text-[rgb(108,95,62)]"
                  >
                    {skillCategory.category}
                  </Heading>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {skillCategory.items.map((item, itemIndex) => (
                      <CircularProgress
                        key={itemIndex}
                        label={item.name}
                        level={item.level}
                        icon={item.icon}
                        iconType={item.iconType}
                        size={90}
                        delay={0}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : timeline ? (
            <div>
              <Text
                size="lg"
                weight="light"
                className="mb-8 leading-7 sm:leading-8 text-base sm:text-lg"
              >
                {content}
              </Text>
              <Timeline items={timeline} />
            </div>
          ) : (
            <Text
              size="lg"
              weight="light"
              className="leading-7 sm:leading-8 text-base sm:text-lg whitespace-pre-line"
            >
              {content}
            </Text>
          )}
        </div>
      </Modal>
    </>
  )
}

export default ContentCard
