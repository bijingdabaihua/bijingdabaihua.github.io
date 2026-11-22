import Image from 'next/image'
import Link from 'next/link'
import ButtonLink from '@/components/button-link'
import ProjectCard from '@/components/project-card'
import { featuredProject, otherProjects, siteConfig } from '@/lib/constants'
import { formatPostDate, getAllPosts } from '@/lib/posts'

const facts = [
  ['Languages', 'TypeScript · Python · Rust (learning)'],
  ['Graphics', 'WebGPU · WGSL · CUDA'],
  ['Web', 'React · Next.js · Vite'],
  ['Tools', 'Git · GitHub Actions · Node.js'],
] as const

function TechTag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-border-light px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
      {children}
    </span>
  )
}

export default function Home() {
  const posts = getAllPosts()

  return (
    <div>
      <section className="mx-auto w-full max-w-[1120px] px-6 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="flex items-start justify-between gap-12">
          <div className="animate-rise min-w-0">
            <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-positive shadow-[0_0_12px] shadow-positive/50" />
              Open to opportunities
            </p>

            <h1 className="mt-7 break-words text-[clamp(1.8rem,7.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-text-primary">
              {siteConfig.name}
            </h1>

            <p className="mt-7 max-w-[620px] text-[clamp(1.35rem,3.2vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em] text-text-primary">
              在浏览器里，从零把光算出来。
            </p>

            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-text-secondary">
              软件工程师，关注图形渲染、前端工程和开发者工具。喜欢从底层理解系统，再把它们做成好用的东西。最近在做 Prism —— 一个不依赖 three.js 的 WebGPU 路径追踪器。
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#work" variant="primary">
                查看作品 ↓
              </ButtonLink>
              <ButtonLink href={`https://github.com/${siteConfig.github}`}>
                GitHub ↗
              </ButtonLink>
              <ButtonLink href={`mailto:${siteConfig.email}`}>
                Email
              </ButtonLink>
            </div>
          </div>

          <div className="hidden shrink-0 lg:block">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-border-light">
              <Image
                src={siteConfig.avatar}
                alt={`${siteConfig.name} 的头像`}
                width={96}
                height={96}
                className="h-full w-full scale-[1.7] object-cover grayscale"
              />
            </div>
            <p className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-text-faint">
              WebGPU / WGSL
            </p>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-6 sm:px-8"
      >
        <div className="flex items-end justify-between border-b border-border-light pb-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
            Selected Work
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint">
            {String(siteConfig.projects.length).padStart(2, '0')} projects
          </span>
        </div>

        <article className="mt-8">
          {featuredProject.cover && (
            <a
              href={featuredProject.demo ?? `/projects/${featuredProject.slug}/`}
              target={featuredProject.demo ? '_blank' : undefined}
              rel={featuredProject.demo ? 'noopener noreferrer' : undefined}
              aria-label={
                featuredProject.demo
                  ? `打开 ${featuredProject.name} 在线 Demo`
                  : `查看 ${featuredProject.name}`
              }
              className="group relative block overflow-hidden rounded-2xl border border-border-light bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={featuredProject.cover}
                alt="Prism 渲染的青花瓷罐搁在夕阳下的砂土地面上"
                width={1280}
                height={720}
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {featuredProject.demo && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-page/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-primary backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                  Live Demo ↗
                </span>
              )}
            </a>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                <span>01</span>
                <span className="h-px w-8 bg-accent/50" />
                <span>Featured</span>
              </div>

              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                <Link
                  href={`/projects/${featuredProject.slug}/`}
                  className="no-underline transition-colors hover:text-accent"
                >
                  {featuredProject.name}
                </Link>
              </h3>

              <p className="mt-3 max-w-[640px] text-[15px] leading-7 text-text-secondary">
                {featuredProject.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {featuredProject.tech.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
                <Link
                  href={`/projects/${featuredProject.slug}/`}
                  className="ml-1 font-mono text-[11px] text-text-secondary underline decoration-border-light underline-offset-4 transition-colors hover:text-text-primary"
                >
                  技术细节 →
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {featuredProject.demo && (
                <ButtonLink href={featuredProject.demo} variant="primary">
                  在线 Demo ↗
                </ButtonLink>
              )}
              <ButtonLink href={featuredProject.url}>源码 ↗</ButtonLink>
            </div>
          </div>
        </article>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index + 2}
            />
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto mt-28 w-full max-w-[1120px] scroll-mt-20 border-t border-border-light px-6 pt-10 sm:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              About
            </h2>
            <p className="mt-5 max-w-[360px] text-2xl font-medium leading-snug tracking-tight text-text-primary">
              把系统拆开，
              <br className="hidden sm:block" />
              再重新搭起来。
            </p>
          </div>

          <div>
            <p className="max-w-[620px] text-[15px] leading-7 text-text-secondary">
              我是 bijingdabaihua，一名软件工程师。我的项目大多不是「用某个框架做一个页面」，而是从边界开始搭：渲染器从 BVH 和采样写起，浏览器扩展从本地词库和消息传递写起，听写工具从模型和热键写起。
            </p>
            <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-text-secondary">
              我关心的是系统能不能被理解、被验证、被继续改进。写代码之外，我也喜欢把做过的决定写下来 —— 这个站上的技术文章就是这些笔记。
            </p>

            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-faint">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto mt-28 w-full max-w-[1120px] border-t border-border-light px-6 pt-10 sm:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Writing
            </h2>
            <Link
              href="/writing/"
              className="font-mono text-[11px] text-text-secondary underline decoration-border-light underline-offset-4 transition-colors hover:text-text-primary"
            >
              全部文章 →
            </Link>
          </div>

          <div className="mt-6 border-y border-border-light">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}/`}
                className="group grid gap-2 border-b border-border-light py-5 no-underline last:border-b-0 sm:grid-cols-[120px_1fr_24px] sm:items-baseline"
              >
                <time className="font-mono text-[11px] text-text-faint">
                  {formatPostDate(post.date)}
                </time>
                <div>
                  <h3 className="text-[15px] font-medium text-text-primary transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="mt-1 max-w-[680px] text-sm leading-6 text-text-secondary">
                      {post.summary}
                    </p>
                  )}
                </div>
                <span className="hidden text-right font-mono text-[12px] text-text-faint transition-transform group-hover:translate-x-0.5 sm:block">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-28 w-full max-w-[1120px] border-t border-border-light px-6 pb-6 pt-10 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
          Contact
        </p>
        <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              有合适的机会，聊聊？
            </h2>
            <p className="mt-3 max-w-[540px] text-sm leading-6 text-text-secondary">
              我在寻找软件工程方向的机会，尤其是图形、前端或开发者工具相关的团队。也欢迎交流 WebGPU、渲染器，或任何你觉得有意思的项目。
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href={`mailto:${siteConfig.email}`} variant="primary">
              发邮件 ↗
            </ButtonLink>
            <ButtonLink href={`https://github.com/${siteConfig.github}`}>
              GitHub ↗
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  )
}
