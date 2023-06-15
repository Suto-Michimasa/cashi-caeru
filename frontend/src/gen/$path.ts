export const pagesPath = {
  "$404": {
    $url: (url?: { hash?: string }) => ({ pathname: '/404' as const, hash: url?.hash })
  },
  "top": {
    $url: (url?: { hash?: string }) => ({ pathname: '/top' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  favicon_ico: '/favicon.ico',
  icon_jpg: '/icon.jpg',
  next_svg: '/next.svg',
  vercel_svg: '/vercel.svg'
} as const

export type StaticPath = typeof staticPath
