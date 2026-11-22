import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-6 pb-20 pt-20">
      <h1 className="font-serif text-[2rem] font-semibold text-text-primary">
        这里没有东西。
      </h1>
      <p className="mt-3 text-[15px] text-text-secondary">
        链接可能过期了，或者页面已经搬走。
      </p>
      <p className="mt-6 text-[13px]">
        <Link href="/" className="link">
          ← 回到首页
        </Link>
      </p>
    </div>
  )
}
