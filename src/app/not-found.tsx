import ButtonLink from '@/components/button-link'

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-start px-6 pb-24 pt-24 sm:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">
        这里没有东西。
      </h1>
      <p className="mt-4 text-sm leading-6 text-text-secondary">
        链接可能过期了，或者页面已经搬走。
      </p>
      <div className="mt-8">
        <ButtonLink href="/" variant="primary">
          ← 回到首页
        </ButtonLink>
      </div>
    </div>
  )
}
