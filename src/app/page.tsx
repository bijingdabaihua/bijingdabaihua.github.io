import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/lib/constants'
import { formatPostDate, getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto w-full max-w-[720px] px-6">
      <section className="pb-12 pt-16 sm:pt-24">
        <h1 className="font-serif text-[clamp(1.9rem,5vw,2.7rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-text-primary">
          <span className="block sm:inline">你好，</span><span className="block sm:inline">我是 {siteConfig.name}。</span>
        </h1>

        <p className="mt-6 text-[1.15rem] leading-9 text-text-primary sm:text-[1.25rem]">
          写代码，也写点东西。对图形渲染、Web 和工具有兴趣。
        </p>

        <p className="mt-4 max-w-[620px] text-[15px] leading-8 text-text-secondary">
          这里放我做过的东西、写过的笔记，以及一些还没想明白的问题。最近在做{' '}
          <Link href="/projects/prism/" className="link">
            Prism
          </Link>{' '}
          —— 一个从零写的 WebGPU 路径追踪器。
        </p>

        <p className="mt-5 text-[12px] leading-6 text-text-faint">
          最近在整理 Prism 的实现笔记，也在学 Rust。
        </p>
      </section>

      <section
        id="writing"
        className="scroll-mt-8 border-t border-border-light py-10"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[1.25rem] text-text-primary">写的</h2>
          <Link href="/writing/" className="link-muted text-[12px]">
            全部文章
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 text-[14px] text-text-secondary">还没写。</p>
        ) : (
          <ul className="mt-6 space-y-7">
            {posts.slice(0, 3).map((post) => (
              <li key={post.slug}>
                <Link href={`/writing/${post.slug}/`} className="group block">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className="font-serif text-[1.15rem] leading-snug text-text-primary transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <time className="shrink-0 font-mono text-[11px] text-text-faint">
                      {formatPostDate(post.date)}
                    </time>
                  </div>
                  {post.summary && (
                    <p className="mt-1.5 text-[14px] leading-7 text-text-secondary">
                      {post.summary}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        id="projects"
        className="scroll-mt-8 border-t border-border-light py-10"
      >
        <h2 className="font-serif text-[1.25rem] text-text-primary">做的</h2>

        <div className="mt-6 space-y-8">
          {siteConfig.projects.map((project) => (
            <article key={project.slug}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="font-serif text-[1.15rem] leading-snug">
                  <Link
                    href={`/projects/${project.slug}/`}
                    className="title-link no-underline"
                  >
                    {project.name}
                  </Link>
                </h3>
                <span className="shrink-0 font-mono text-[11px] text-text-faint">
                  {project.tech.slice(0, 3).join(' · ')}
                </span>
              </div>

              <div
                className={
                  project.cover
                    ? 'mt-3 grid gap-4 sm:grid-cols-[1fr_200px] sm:items-start'
                    : 'mt-2'
                }
              >
                <div>
                  <p className="text-[14px] leading-7 text-text-secondary">
                    {project.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-muted"
                      >
                        在线 Demo ↗
                      </a>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-muted"
                    >
                      源码 ↗
                    </a>
                    {project.post && (
                      <Link
                        href={`/writing/${project.post}/`}
                        className="link-muted"
                      >
                        技术笔记
                      </Link>
                    )}
                  </div>
                </div>

                {project.cover && (
                  <Link
                    href={`/projects/${project.slug}/`}
                    aria-label={`查看 ${project.name} 项目`}
                    className="block overflow-hidden rounded-sm border border-border-light"
                  >
                    <Image
                      src={project.cover}
                      alt={`${project.name} 的渲染图`}
                      width={1280}
                      height={720}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-8 border-t border-border-light py-10"
      >
        <h2 className="font-serif text-[1.25rem] text-text-primary">关于</h2>

        <div className="mt-5 max-w-[620px] space-y-4 text-[15px] leading-8 text-text-secondary">
          <p>大部分时间在做两件事：把系统拆开看懂，再把它们做成能用的东西。</p>
          <p>
            对图形渲染、Web 和开发者工具有兴趣。平时主要写 TypeScript 和 Python，最近在学 Rust。这个站上的项目大多是从边界开始搭的；文章则是做项目时留下的笔记。
          </p>
          <p>
            如果你也在做类似的事，或者只是想聊聊，可以写信到{' '}
            <a href={`mailto:${siteConfig.email}`} className="link">
              {siteConfig.email}
            </a>
            ，也可以在{' '}
            <a
              href={`https://github.com/${siteConfig.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              GitHub
            </a>{' '}
            找到我。
          </p>
        </div>
      </section>
    </div>
  )
}
