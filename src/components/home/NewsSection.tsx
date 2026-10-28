'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { useLang } from '@/context/LangContext'

interface DynamicArticle {
  title: string
  link: string
  date: string
  source: string
  image: string
  readTime: string
}

// Fallback articles in case the RSS feed fails or is loading
const defaultArticles: DynamicArticle[] = [
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80',
    source: 'MARKET REPORT',
    date: 'June 2025',
    readTime: '5 min read',
    title: 'Indore Luxury Real Estate Market Surges 18% in 2025 — What Buyers Need to Know',
    link: 'https://news.google.com',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    source: 'REGULATION',
    date: 'May 2025',
    readTime: '3 min read',
    title: 'RERA 2025 — What Every Luxury Home Buyer in MP Must Check Before Signing',
    link: 'https://news.google.com',
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    source: 'BUYING GUIDE',
    date: 'Apr 2025',
    readTime: '4 min read',
    title: '10 Non-Negotiable Checks Before Buying a Luxury Villa in Indore',
    link: 'https://news.google.com',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    source: 'INSIDER',
    date: 'Mar 2025',
    readTime: '6 min read',
    title: "Off-Market Properties — Why India's Wealthiest Buy What's Never Listed",
    link: 'https://news.google.com',
  },
]

export default function NewsSection() {
  const { lang } = useLang()
  const [articles, setArticles] = useState<DynamicArticle[]>(defaultArticles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.articles && data.articles.length > 0) {
          setArticles(data.articles)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching real-time news:', err)
        setLoading(false)
      })
  }, [])

  const mainArticle = articles[0]
  const sideArticles = articles.slice(1, 4)

  return (
    <section className="py-24 bg-[#FAF9F6] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="block text-[0.7rem] font-bold tracking-[4px] uppercase text-[#A4855C] mb-3">
            {lang === 'en' ? 'INSIGHTS & UPDATES' : 'अद्यतन और जानकारियां'}
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#11161E] leading-tight">
            {lang === 'en' ? 'Real Estate News & Guides' : 'रियल एस्टेट समाचार और गाइड'}
          </h2>
          <div className="w-14 h-0.5 bg-[#C5A880] mt-4 mx-auto" />
        </div>

        {/* Shimmer Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 animate-pulse">
            <div className="lg:col-span-7 bg-white border border-[#EAE6E1] rounded-2xl overflow-hidden h-[540px]" />
            <div className="lg:col-span-5 flex flex-col gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-[#EAE6E1] rounded-2xl p-5 h-[140px]" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Main Featured Article (Left - 7 cols) */}
            {mainArticle && (
              <div className="lg:col-span-7 bg-white border border-[#EAE6E1] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                <div className="relative h-[280px] w-full overflow-hidden">
                  <img 
                    src={mainArticle.image} 
                    alt="Main Featured Article"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
                  <span className="absolute top-4 left-4 bg-[#C5A880] text-[#11161E] text-[0.65rem] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                    {mainArticle.source}
                  </span>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-[#68717A] mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {mainArticle.date}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EAE6E1]" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mainArticle.readTime}
                      </span>
                    </div>
                    <h3 className="font-playfair text-xl md:text-2xl font-semibold text-[#11161E] mb-4 leading-snug hover:text-[#A4855C] transition-colors duration-300">
                      <a href={mainArticle.link} target="_blank" rel="noopener noreferrer">
                        {mainArticle.title}
                      </a>
                    </h3>
                  </div>
                  <a 
                    href={mainArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#A4855C] hover:text-[#11161E] transition-colors group"
                  >
                    {lang === 'en' ? 'Read Article' : 'लेख पढ़ें'} 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            )}

            {/* List Articles (Right - 5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {sideArticles.map((article, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-[#EAE6E1] rounded-2xl p-5 flex gap-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <div className="flex items-center gap-3 text-[0.68rem] text-[#68717A] mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#EAE6E1]" />
                        <span className="flex items-center gap-1 font-semibold text-[#A4855C]">
                          {article.source}
                        </span>
                      </div>
                      <h4 className="font-playfair text-sm font-semibold text-[#11161E] leading-snug line-clamp-2 hover:text-[#A4855C] transition-colors duration-300">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h4>
                    </div>
                    <a 
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A4855C] hover:text-[#11161E] transition-colors group mt-2"
                    >
                      {lang === 'en' ? 'Read Source' : 'स्रोत पढ़ें'} 
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Button redirects to Google News search */}
        <div className="text-center">
          <a 
            href="https://news.google.com/search?q=Indian+real+estate+property"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#C5A880] text-[#A4855C] 
                       hover:bg-[#C5A880] hover:text-[#11161E] rounded-lg font-semibold text-sm transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            {lang === 'en' ? 'View All Articles & News' : 'सभी लेख और समाचार देखें'}
          </a>
        </div>
      </div>
    </section>
  )
}
