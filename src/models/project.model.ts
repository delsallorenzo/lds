export interface Project {
  slug: string
  poster: string
  title: string
  desc: string
  media: string
  link?: string
  linkText?: string
  extraInfo?: ExtraInfo
}
export interface ExtraInfo {
  pictures?: string[]
}
