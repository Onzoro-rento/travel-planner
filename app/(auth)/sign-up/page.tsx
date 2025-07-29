import { getProviders } from 'next-auth/react'
import SignUpForm   from './signUpForm' // 次に作成するクライアントコンポーネント

export default async function SignUpPage() {
  // サーバーサイドでプロバイダー情報を取得
  const providers = await getProviders().then((res) => {
    console.log('Providers:', res)
    return res
  })

  return <SignUpForm providers={providers} />
}