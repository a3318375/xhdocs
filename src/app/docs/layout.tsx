import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();
  // 导航里的「文章」链接会在侧栏也渲染一次，且对 /docs/* 永远算激活（nested-url），
  // 会和当前文章同时高亮。侧栏已经有页面树，这里把导航链接去掉，只留页面树。
  const { links: _links, ...layoutProps } = baseOptions();

  return (
    <DocsLayout tree={tree} {...layoutProps} links={[]}>
      {children}
    </DocsLayout>
  );
}
