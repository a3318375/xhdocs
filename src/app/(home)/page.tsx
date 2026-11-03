import Link from 'next/link';
import fs from 'node:fs';
import path from 'node:path';
import { ArrowRight, ArrowUpRight, BookOpen, Terminal } from 'lucide-react';
import { source } from '@/lib/source';
import { appName, gitConfig } from '@/lib/shared';

type Post = {
  url: string;
  title: string;
  description: string;
};

type Page = ReturnType<typeof source.getPages>[number];

function toPost(page: Page): Post {
  return {
    url: page.url,
    title: page.data.title,
    description: page.data.description ?? '',
  };
}

/** Top-level articles in the exact order defined by content/docs/meta.json. */
function getPosts(): Post[] {
  const pages = source.getPages().filter((page) => page.slugs.length === 1);

  let order: string[] = [];
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'content/docs/meta.json'), 'utf8');
    const meta = JSON.parse(raw) as { pages?: unknown };
    if (Array.isArray(meta.pages)) {
      order = meta.pages.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // meta.json is optional; fall back to the source order.
  }

  const slugOf = (page: Page) => page.slugs[page.slugs.length - 1] ?? '';
  const bySlug = new Map(pages.map((page) => [slugOf(page), page] as const));

  return [
    ...order.flatMap((slug) => {
      const page = bySlug.get(slug);
      return page ? [toPost(page)] : [];
    }),
    ...pages.filter((page) => !order.includes(slugOf(page))).map(toPost),
  ];
}

export default function HomePage() {
  const posts = getPosts();
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-3xl px-6 pt-20 pb-14 sm:pt-28">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs text-fd-muted-foreground">
          <span className="size-1.5 rounded-full bg-fd-primary" />
          折腾记录 · 踩坑笔记
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{appName}</h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-fd-muted-foreground">
          自建服务的折腾记录：NAS、反向代理、Docker，还有后端开发里踩过的坑。
          写得慢，但都是真跑过的东西。
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            <BookOpen className="size-4" />
            读博客
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <Terminal className="size-4" />
            源码
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="mb-5 flex items-end justify-between border-b border-fd-border pb-3">
          <h2 className="text-sm font-semibold tracking-widest text-fd-muted-foreground uppercase">
            最近文章
          </h2>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            全部 {posts.length} 篇
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <ul className="divide-y divide-fd-border">
          {posts.slice(0, 6).map((post) => (
            <li key={post.url}>
              <Link href={post.url} className="group flex items-start gap-4 py-5">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium leading-snug transition-colors group-hover:text-fd-primary">
                    {post.title}
                  </h3>
                  {post.description ? (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-fd-muted-foreground">
                      {post.description}
                    </p>
                  ) : null}
                </div>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-fd-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fd-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-auto border-t border-fd-border">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-fd-muted-foreground">
          <span>© {appName} · 内容按 CC BY-NC-SA 4.0 共享</span>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-fd-foreground"
          >
            {gitConfig.user}/{gitConfig.repo}
          </a>
        </div>
      </footer>
    </main>
  );
}
