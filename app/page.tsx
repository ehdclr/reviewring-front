'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FileText, UserCheck, Shield, Clock, Upload, FileCheck, MessageCircle, TrendingUp } from 'lucide-react'

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-2xl p-6 flex items-center gap-4"
  >
    <div className="text-[#1A1B1E] bg-gray-100 p-4 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-[#1A1B1E]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
)

const ProcessStep = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center text-center"
  >
    <div className="text-white bg-[#2A2B2E] p-4 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
)

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const controls = useAnimation()
  const [showServiceIntro, setShowServiceIntro] = useState(false)

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY)
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId!)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', debouncedHandleScroll)
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [handleScroll])

  useEffect(() => {
    controls.start({ y: scrollY * 0.5 })
  }, [scrollY, controls])

  return (
    <div className="min-h-screen bg-[#1A1B1E]">
      <div className="fixed inset-0 bg-gradient-to-b from-[#1A1B1E] to-[#2A2B2E] z-[-1]" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <Card className="bg-[#2A2B2E]/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-0">
          <CardContent className="p-8 md:p-12 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 relative z-10"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  이력서를 리뷰받고
                  <br />
                  커리어를 성장시키세요
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  전문가들의 객관적인 피드백으로 당신의 이력서를 한 단계 발전시켜보세요
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#1A1B1E] hover:bg-gray-200 px-8"
                >
                  <Link href="/signin">무료로 시작하기</Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-[#3A3B3E] text-white hover:bg-[#4A4B4E] px-8"
                  onClick={() => setShowServiceIntro(true)}
                >
                  서비스 소개
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"
              animate={controls}
              initial={{ y: 0 }}
            />
          </CardContent>
        </Card>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-20">
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="익명 이력서 평가"
            description="개인정보 없이 객관적인 평가를 받아보세요."
            delay={0.2}
          />
          <FeatureCard
            icon={<UserCheck className="w-8 h-8" />}
            title="인증된 멘토"
            description="각 분야의 전문가들이 솔직한 피드백을 제공합니다."
            delay={0.3}
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="보안 강화"
            description="PDF 변환으로 개인정보를 더욱 안전하게 보호합니다."
            delay={0.4}
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="빠른 피드백"
            description="48시간 이내에 상세한 첨삭 결과를 받아보세요."
            delay={0.5}
          />
        </div>      
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-12">서비스 프로세스</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <ProcessStep
              icon={<Upload className="w-6 h-6" />}
              title="이력서 업로드"
              description="익명으로 이력서를 업로드합니다"
              delay={0.7}
            />
            <ProcessStep
              icon={<FileCheck className="w-6 h-6" />}
              title="PDF 변환"
              description="개인정보를 보호하며 PDF로 변환됩니다"
              delay={0.8}
            />
            <ProcessStep
              icon={<MessageCircle className="w-6 h-6" />}
              title="전문가 리뷰"
              description="인증된 멘토가 상세히 검토합니다"
              delay={0.9}
            />
            <ProcessStep
              icon={<TrendingUp className="w-6 h-6" />}
              title="피드백 확인"
              description="빨간펜 첨삭과 코멘트를 확인합니다"
              delay={1}
            />
          </div>
        </motion.div>
      </main>

      {/* Service Introduction Dialog */}
      <Dialog open={showServiceIntro} onOpenChange={setShowServiceIntro}>
        <DialogContent className="bg-[#2A2B2E] text-white">
          <DialogHeader>
            <DialogTitle>리뷰링 서비스 소개</DialogTitle>
            <DialogDescription>
              리뷰링은 익명 이력서 리뷰 플랫폼으로, 전문가의 객관적인 피드백을 통해 여러분의 커리어 성장을 돕습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-semibold">주요 특징</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>익명성 보장: 개인정보 없이 순수한 이력서 내용만으로 평가</li>
              <li>전문가 리뷰: 각 분야의 인증된 전문가들이 상세한 피드백 제공</li>
              <li>보안 강화: PDF 변환을 통한 개인정보 보호</li>
              <li>빠른 피드백: 48시간 이내 첨삭 결과 제공</li>
            </ul>
            <h3 className="text-lg font-semibold mt-6">이용 방법</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>회원가입 후 익명으로 이력서 업로드</li>
              <li>시스템이 자동으로 이력서를 PDF로 변환</li>
              <li>전문가가 이력서를 검토하고 피드백 작성</li>
              <li>상세한 첨삭 결과 및 코멘트 확인</li>
              <li>피드백을 반영하여 이력서 개선</li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}