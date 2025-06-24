export interface Project {
  title: string
  desc: string
  media: string
  link?: string
  linkText?: string
  extraInfo?: ExtraInfo
}
export interface ExtraInfo {
  details: string
  pictures?: string[]
}
