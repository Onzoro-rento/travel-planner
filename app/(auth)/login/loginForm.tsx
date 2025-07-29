'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Mail, Lock, AlertCircle, Loader2, Github } from 'lucide-react'
import type { getProviders } from 'next-auth/react'

// import Image from 'next/image'

export default function LoginForm({ providers }: { providers: Awaited<ReturnType<typeof getProviders>> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/trips'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [customError, setCustomError] = useState('')
  

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setCustomError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setCustomError('メールアドレスまたはパスワードが正しくありません')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setCustomError('ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  
  const getErrorMessage = () => {
    if (customError) return customError
    if (error === 'OAuthSignin') return 'OAuth認証エラーが発生しました'
    if (error === 'OAuthCallback') return 'OAuth認証エラーが発生しました'
    if (error === 'OAuthCreateAccount') return 'アカウントの作成に失敗しました'
    if (error === 'EmailCreateAccount') return 'アカウントの作成に失敗しました'
    if (error === 'Callback') return '認証エラーが発生しました'
    if (error === 'OAuthAccountNotLinked') return 'このメールアドレスは別の方法で登録されています'
    if (error === 'EmailSignin') return 'メールの送信に失敗しました'
    if (error === 'CredentialsSignin') return 'ログイン情報が正しくありません'
    if (error === 'default') return 'エラーが発生しました'
    return null
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* ロゴとタイトル */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">旅プランナー</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">おかえりなさい！</h1>
          <p className="text-gray-600">アカウントにログインして旅の計画を続けましょう</p>
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* ログインフォーム */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
            {providers && Object.values(providers).filter((provider) => provider.type === 'oauth').map((provider) => {
            return (
              <div key={provider.id} className="mb-4">
                {/* GitHubログイン */}
                <button
                  onClick={() => (
                    setIsLoading(true), 
                    signIn(provider.id, { callbackUrl }))
                  }
                  
                  className="w-full flex items-center justify-center space-x-3 bg-gray-800 text-white rounded-lg px-4 py-3 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-medium">GitHubでログイン</span>
                </button>
              </div>
            );
    })}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">または</span>
            </div>
          </div>

          {/* メールログインフォーム */}
          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">ログイン情報を保存</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                パスワードを忘れた方
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ログイン中...
                </>
              ) : (
                'ログイン'
              )}
            </button>
          </form>
        </div>

        {/* 新規登録リンク */}
        <p className="mt-6 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は{' '}
          <Link href="/sign-up
          " className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}