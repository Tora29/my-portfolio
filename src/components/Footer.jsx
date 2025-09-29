import React from 'react'

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerLinks = [
    { id: 'about', label: 'ABOUT ME' },
    { id: 'work', label: 'WORK' },
    { id: 'history', label: 'HISTORY' },
    { id: 'blog', label: 'BLOG' },
    { id: 'contact', label: 'CONTACT' },
  ]

  return (
    <footer className="w-full h-48 bg-[rgb(23,24,32)] overflow-hidden">
      <div className="h-full flex items-center justify-center">
        <div className="flex">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.id}>
              <button
                onClick={() => scrollToSection(link.id)}
                className="px-6 md:px-8 flex items-center justify-center hover:text-[rgb(108,95,62)] transition-colors"
              >
                <span className="text-[rgb(199,195,187)] text-lg md:text-xl font-normal font-['Rubik'] leading-tight">
                  {link.label}
                </span>
              </button>
              {index < footerLinks.length - 1 && (
                <div className="w-px h-8 bg-[rgb(199,195,187)] self-center"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
