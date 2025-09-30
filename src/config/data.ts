import { User, Briefcase, History, BookOpen, Mail } from 'lucide-react'
import { NavItem, SocialLinks, SiteInfo, IconMapType } from '../types'
import aboutMeImage from '../assets/aboutMeImage.png'
import skillImage from '../assets/skillImage.png'
import workImage from '../assets/worktImage.png'
import blogImage from '../assets/blogImage.png'
import contactImage from '../assets/contactImage.png'

// ナビゲーション項目
export const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'about',
    label: 'ABOUT ME',
    imageSrc: aboutMeImage,
    summary: '要件定義から実装・運用まで。全工程を一貫して担える技術者です。',
    content: '私のキャリアを紹介します。',
    imagePosition: 'object-[center_0%]',
    timeline: [
      {
        date: '2020年',
        title: '私立文系大学 卒業',
        description: '大学卒業後、エンジニアの道へ',
        type: 'education',
      },
      {
        date: '2021年',
        title: '中規模SIer 入社',
        description:
          '官公庁案件やSESで開発のテストや実装を経験\nエンジニアとしての基礎を築く',
        type: 'work',
      },
      {
        date: '2023年',
        title: '大手シンクタンクに転職',
        description:
          '大規模案件のPL・PM を担当\nプロジェクト管理やチームマネジメントのスキルを習得',
        type: 'work',
      },
      {
        date: '2024年',
        title: 'Web系ベンチャーに転職',
        description:
          'ITコンサルから要件定義、実装、保守運用まで全工程を担当\nフルスタックエンジニアとして、技術選定から運用まで一貫して対応',
        type: 'work',
      },
    ],
  },
  {
    id: 'skills',
    label: 'SKILLS',
    imageSrc: skillImage,
    summary: '使用可能な技術スタックと習熟度を紹介します。',
    content: 'スキルスタック',
    skills: [
      {
        category: 'Frontend',
        items: [
          { name: 'Svelte', level: 4, icon: 'siSvelte' },
          { name: 'SvelteKit', level: 4, icon: 'siSvelte' },
          { name: 'React', level: 3, icon: 'siReact' },
          { name: 'Next.js', level: 3, icon: 'siNextdotjs' },
          { name: 'Daisy UI', level: 4, icon: 'siDaisyui' },
          { name: 'Tailwind CSS', level: 3, icon: 'siTailwindcss' },
        ],
      },
      {
        category: 'Backend',
        items: [
          { name: 'Node.js', level: 4, icon: 'siNodedotjs' },
          { name: 'Java', level: 3, icon: 'siOracle' },
          { name: 'Spring Boot', level: 3, icon: 'siSpring' },
          { name: 'Python', level: 2, icon: 'siPython' },
          { name: 'FastAPI', level: 2, icon: 'siFastapi' },
        ],
      },
      {
        category: 'Database',
        items: [
          { name: 'Postgre', level: 3, icon: 'siPostgresql' },
          { name: 'MySQL', level: 2, icon: 'siMysql' },
        ],
      },
      {
        category: 'Infrastructure & Tools',
        items: [
          { name: 'CI/CD', level: 4, icon: 'RefreshCw', iconType: 'lucide' },
          { name: 'Git', level: 3, icon: 'siGit' },
          { name: 'AWS', level: 2, icon: 'Cloud', iconType: 'lucide' },
          { name: 'Docker', level: 2, icon: 'siDocker' },
        ],
      },
      {
        category: 'Testing',
        items: [
          { name: 'Vitest', level: 4, icon: 'siVitest' },
          { name: 'Playwright', level: 3, icon: 'Drama', iconType: 'lucide' },
        ],
      },
      {
        category: 'Project Management',
        items: [
          { name: 'Development', level: 4, icon: 'Code', iconType: 'lucide' },
          {
            name: 'Operations',
            level: 4,
            icon: 'Settings',
            iconType: 'lucide',
          },
          { name: 'Design', level: 3, icon: 'Palette', iconType: 'lucide' },
          { name: 'Tech Lead', level: 3, icon: 'Users', iconType: 'lucide' },
          {
            name: 'Requirements',
            level: 2,
            icon: 'FileText',
            iconType: 'lucide',
          },
        ],
      },
    ],
  },
  {
    id: 'work',
    label: 'WORK',
    imageSrc: workImage,
    summary: '制作実績を紹介します。（準備中）',
    content: 'Work In Progress',
  },
  {
    id: 'blog',
    label: 'BLOG',
    imageSrc: blogImage,
    summary: '技術ブログへのリンク。（準備中）',
    content: 'ブログ構築し終わったらここから遷移させるやで',
  },
  {
    id: 'contact',
    label: 'CONTACT',
    imageSrc: contactImage,
    summary: 'お仕事のご相談はこちらからお気軽にどうぞ。',
    content: 'ここからワイに直接コンタクト♡',
  },
] as const

// ソーシャルリンク
export const SOCIAL_LINKS: SocialLinks = {
  github: 'https://github.com/Tora29',
  twitter: '',
  linkedin: '',
} as const

// サイト情報
export const SITE_INFO: SiteInfo = {
  title: "Tora29's Lab",
  subtitle: 'WEB ENGINEER',
  description: 'ポートフォリオサイト',
  author: 'Tora29',
} as const

// アイコンマッピング
export const ICON_MAP: IconMapType = {
  about: User,
  skills: History,
  work: Briefcase,
  blog: BookOpen,
  contact: Mail,
} as const
