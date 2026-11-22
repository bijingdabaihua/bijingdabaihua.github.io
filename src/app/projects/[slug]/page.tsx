import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/lib/constants'
import type { Project } from '@/types'

type PageProps = {
  params: Promise<{ slug: string }>
}

function findProject(slug: string): Project | undefined {
  return siteConfig.projects.find((project) => project.slug === slug)
}

export const dynamicParams = false

export function generateStaticParams() {
  return siteConfig.projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)

  if (!project) return {}

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = findProject(slug)

  if (!project) notFound()

  return (
    <div className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-10">
      <Link
        href="/#projects"
        className="link-muted text-[12px] no-underline"
      >
        ← 返回
      </Link>

      <header className="mt-10">
        <h1 className="text-balance font-serif text-[clamp(2.2rem,5vw,2.8rem)] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
          {project.name}
        </h1>

        <p className="mt-4 text-[15px] leading-8 text-text-secondary">
          {project.description}
        </p>

        <p className="mt-3 font-mono text-[10px] text-text-faint">
          {project.tech.join(' · ')}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              在线 Demo ↗
            </a>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            源码 ↗
          </a>
          {project.post && (
            <Link href={`/writing/${project.post}/`} className="link">
              技术笔记
            </Link>
          )}
        </div>
      </header>

      {project.cover && (
        <figure className="mt-8">
          <a
            href={project.demo ?? project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`打开 ${project.name}`}
            className="block overflow-hidden rounded-sm border border-border-light"
          >
            <Image
              src={project.cover}
              alt={`${project.name} 的渲染图`}
              width={1280}
              height={720}
              priority
              className="aspect-[16/9] w-full object-cover"
            />
          </a>
          <figcaption className="mt-2 text-[11px] text-text-faint">
            {project.slug === 'prism' ? '荒地 / Prism 渲染' : project.name}
          </figcaption>
        </figure>
      )}

      <section className="mt-12 border-t border-border-light pt-8">
        <h2 className="font-serif text-[1.25rem] text-text-primary">
          关于这个项目
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-8 text-text-secondary">
          {project.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {project.highlights && project.highlights.length > 0 && (
        <section className="mt-10 border-t border-border-light pt-8">
          <h2 className="font-serif text-[1.25rem] text-text-primary">
            一些实现细节
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-8 text-text-secondary marker:text-text-faint">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}

      {project.demo && (
        <section className="mt-10 border-t border-border-light pt-8">
          <h2 className="font-serif text-[1.25rem] text-text-primary">
            在线试试
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-text-secondary">
            需要支持 WebGPU 的浏览器（Chrome / Edge 113+，或已开启 WebGPU 的
            Safari）。首次打开会下载并解码几十 MB 的场景资产，加载完成后画面会持续累积变干净。
          </p>
          <p className="mt-3 text-[14px]">
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              打开在线 Demo ↗
            </a>
          </p>
        </section>
      )}

      <div className="mt-12 flex items-center justify-between border-t border-border-light pt-6 text-[13px]">
        <Link href="/#projects" className="link-muted no-underline">
          ← 返回
        </Link>
        <Link href="/writing/" className="link-muted no-underline">
          文章
        </Link>
      </div>
    </div>
  )
}
