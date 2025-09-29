import React, { useState } from 'react'
import {
  User,
  Briefcase,
  History,
  BookOpen,
  Mail,
  Github,
  Menu,
} from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'about', label: 'ABOUT ME', icon: User },
    { id: 'work', label: 'WORK', icon: Briefcase },
    { id: 'history', label: 'HISTORY', icon: History },
    { id: 'blog', label: 'BLOG', icon: BookOpen },
    { id: 'contact', label: 'CONTACT', icon: Mail },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(23,24,32)] px-4 md:px-20 py-3">
      <div className="flex justify-between items-center">
        <div className="text-3xl md:text-4xl font-normal font-['Rubik'] leading-tight">
          <span className="text-[rgb(199,195,187)]">Tora</span>
          <span className="text-[rgb(108,95,62)]">29</span>
        </div>

        <nav className="hidden md:flex justify-start items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative w-24 h-16 bg-[rgb(12,13,21)] rounded-lg flex flex-col items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors"
              >
                <Icon className="w-5 h-5 text-[rgb(199,195,187)] mb-1" />
                <span className="text-[rgb(199,195,187)] text-xs font-normal font-['Rubik'] leading-tight">
                  {item.label}
                </span>
              </button>
            )
          })}
          <a
            href="https://github.com/Tora29"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-24 h-16 bg-[rgb(12,13,21)] rounded-lg flex flex-col items-center justify-center hover:bg-[rgb(108,95,62)] transition-colors"
          >
            <Github className="w-5 h-5 text-[rgb(199,195,187)] mb-1" />
            <span className="text-[rgb(199,195,187)] text-xs font-normal font-['Rubik'] leading-tight">
              GitHub
            </span>
          </a>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[rgb(199,195,187)]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[rgb(23,24,32)] border-t border-[rgb(199,195,187)]/20 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left px-8 py-3 text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://github.com/Tora29"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left px-8 py-3 text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)] transition-colors"
          >
            GitHub
          </a>
        </div>
      )}
    </header>
  )
}

export default Header
