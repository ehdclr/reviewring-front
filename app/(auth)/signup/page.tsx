'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isEmailAvailable, setIsEmailAvailable] = useState(true)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true)
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement sign up logic
    console.log('Sign up attempt with:', { email, password, confirmPassword, name, nickname, phoneNumber })
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 11) //숫자만 입력
    setPhoneNumber(input)
    setIsPhoneNumberValid(validatePhoneNumber(input))
  }



  const validatePassword = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]+/)) strength += 25
    if (password.match(/[A-Z]+/)) strength += 25
    if (password.match(/[0-9]+/)) strength += 25
    return strength
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const formatPhoneNumber = (number: string) => {
    if (number.length === 10) {
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`
    } else if (number.length === 11) {
      return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`
    }
    return number
  }

  const checkEmailAvailability = async () => {
    // TODO: Implement email availability check
    console.log('Checking email availability:', email)
    setIsEmailAvailable(true) // Placeholder: assume email is available
  }

  const checkNicknameAvailability = async () => {
    // TODO: Implement nickname availability check
    console.log('Checking nickname availability:', nickname)
    setIsNicknameAvailable(true) // Placeholder: assume nickname is available
  }

  const validatePhoneNumber = (phoneNumber: string) => {
    return /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/.test(phoneNumber)
  }

  useEffect(() => {
    setPasswordStrength(validatePassword(password))
  }, [password])

  useEffect(() => {
    setIsEmailValid(validateEmail(email))
  }, [email])

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
          <CardDescription className="text-center">리뷰링에 새 계정을 만드세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Button type="button" onClick={checkEmailAvailability} disabled={!isEmailValid}>
                  중복확인
                </Button>
              </div>
              {!isEmailValid && email && <p className="text-sm text-red-500">유효한 이메일 주소를 입력해주세요.</p>}
              {!isEmailAvailable && <p className="text-sm text-red-500">이미 사용 중인 이메일입니다.</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <Progress value={passwordStrength} className="w-full" />
              <p className="text-sm text-gray-500">
                {passwordStrength < 50 ? '약함' : passwordStrength < 75 ? '보통' : '강함'}
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
              {password !== confirmPassword && confirmPassword && (
                <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <div className="flex space-x-2">
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full"
                />
                <Button type="button" onClick={checkNicknameAvailability}>
                  중복확인
                </Button>
              </div>
              {!isNicknameAvailable && <p className="text-sm text-red-500">이미 사용 중인 닉네임입니다.</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <Input
                id="phone-number"
                name="phone-number"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full"
                placeholder="'-' 없이 숫자만 입력해주세요"
              />
              {phoneNumber &&(
                <p className="text-sm text-gray-500">
                    형식 : {formatPhoneNumber(phoneNumber)}
                </p>
              )}
              {phoneNumber && !isPhoneNumberValid && (
                <p className='text-sm text-red-500'>
                    유효한 전화번호를 입력해주세요.
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/signin" className="font-medium text-primary hover:text-primary/80">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}