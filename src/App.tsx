import Header from './components/Header'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import SectionCard from './components/SectionCard'
import ContentCard from './components/ContentCard'
import SectionTitle from './components/SectionTitle'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import useScrollTo from './hooks/useScrollTo'
import { NAV_ITEMS } from './config/constants'

/**
 * ポートフォリオアプリケーションのメインコンポーネント
 * @returns ポートフォリオページ全体のJSX要素
 */
function App() {
  const { scrollToElement } = useScrollTo()

  return (
    <div className="min-h-screen bg-[rgb(12,13,21)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
      <ParticleBackground />
      <Header />
      <main className="relative z-10 pt-[60px]">
        <Hero />

        <section className="py-12">
          <SectionTitle title="WELCOME" />
          <Carousel>
            {NAV_ITEMS.map((item) => (
              <SectionCard
                key={item.id}
                title={item.label}
                imageSrc={item.imageSrc}
                onClick={() => scrollToElement(item.id)}
              />
            ))}
          </Carousel>
        </section>

        {NAV_ITEMS.map((item) => (
          <section key={item.id} id={item.id} className="py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <SectionTitle title={item.label} />
              <div className="flex justify-center">
                <ContentCard
                  title={item.id === 'about' ? 'Tora29' : item.label}
                  summary={item.summary}
                  content={item.content}
                  imageSrc={item.imageSrc}
                  imagePosition={item.imagePosition}
                  skills={item.skills}
                  timeline={item.timeline}
                />
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}

export default App
