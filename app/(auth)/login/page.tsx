import { getProviders } from 'next-auth/react'
import LoginForm from './loginForm' // 次に作成するクライアントコンポーネント

export default async function LoginPage() {
  // サーバーサイドでプロバイダー情報を取得
  const providers = await getProviders().then((res) => {
    console.log('Providers:', res)
    return res
  })

  return <LoginForm providers={providers} />
}