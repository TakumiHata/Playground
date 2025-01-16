import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'client',
    renderMode: RenderMode.Client, // クライアントサイドレンダリング
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender, // プリレンダリング(+ハイドレーション)
  },
];
