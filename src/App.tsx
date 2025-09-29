import Header from './components/Header'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import SectionCard from './components/SectionCard'
import ContentCard from './components/ContentCard'
import SectionTitle from './components/SectionTitle'
import Footer from './components/Footer'
import { Section, ContentData } from './types/content'
import aboutMeImage from './assets/aboutMeImage.png'
import workImage from './assets/worktImage.png'
import historyImage from './assets/historyImage.png'
import blogImage from './assets/blogImage.png'
import contactImage from './assets/contactImage.png'

function App() {
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sections: Section[] = [
    { id: 'about', title: 'ABOUT ME', imageSrc: aboutMeImage },
    { id: 'work', title: 'WORK', imageSrc: workImage },
    { id: 'history', title: 'HISTORY', imageSrc: historyImage },
    { id: 'blog', title: 'BLOG', imageSrc: blogImage },
    { id: 'contact', title: 'CONTACT', imageSrc: contactImage },
  ]

  const contentData: Record<string, ContentData> = {
    about: {
      title: 'Tora29',
      content:
        '大学卒業後、SESとしてWEB系メガベンチャーに常駐し、エンジニアのキャリアをスタート。その後、大手シンクタンクに転職し、メガバンクのシステム開発でPMを務め、300人月超えの大規模案件をリード。現在は、提案からデザインを含む要件定義、保守運用まで全工程を担当し、技術者としての力を発揮。WEB技術を通じてお客様の成功や幸せにコミットすることを目標に、自身も日々成長を追求している。くぅ～かっこいいぜ。',
      imageSrc: aboutMeImage,
      imagePosition: 'object-[center_0%]',
    },
    work: {
      title: 'WORK',
      content: 'Work In Progress',
      imageSrc: workImage,
    },
    history: {
      title: 'HISTORY',
      content: 'ワイの歴史を紐解いていくで',
      imageSrc: historyImage,
    },
    blog: {
      title: 'BLOG',
      content: 'ブログ構築し終わったらここから遷移させるやで',
      imageSrc: blogImage,
    },
    contact: {
      title: 'CONTACT',
      content: 'ここからワイに直接コンタクト♡',
      imageSrc: contactImage,
    },
  }

  return (
    <div className="min-h-screen bg-[rgb(12,13,21)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <Header />
      <main className="pt-20">
        <Hero />

        <section className="py-12">
          <SectionTitle title="WELCOME" />
          <Carousel>
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                title={section.title}
                imageSrc={section.imageSrc}
                onClick={() => scrollToSection(section.id)}
              />
            ))}
          </Carousel>
        </section>

        <section id="about" className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="ABOUT ME" />
            <div className="flex justify-center">
              <ContentCard {...contentData.about} />
            </div>
          </div>
        </section>

        <section id="work" className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="WORK" />
            <div className="flex justify-center">
              <ContentCard {...contentData.work} />
            </div>
          </div>
        </section>

        <section id="history" className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="HISTORY" />
            <div className="flex justify-center">
              <ContentCard {...contentData.history} />
            </div>
          </div>
        </section>

        <section id="blog" className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="BLOG" />
            <div className="flex justify-center">
              <ContentCard {...contentData.blog} />
            </div>
          </div>
        </section>

        <section id="contact" className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="CONTACT" />
            <div className="flex justify-center">
              <ContentCard {...contentData.contact} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
