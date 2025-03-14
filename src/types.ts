export enum SelectorEnum {
  IMG = 'diagram-m',
  MODAL = 'data-diagram-modal',
  PLANTUML = 'data-diagram-plantuml',
  MERMAID = 'data-diagram-mermaid',
}

export interface BaseOptions {
  /**
   * if show controller
   */
  showController?: boolean
}

export interface PlantumlOptions extends BaseOptions {
  /**
   * image format
   */
  imageFormat?: 'png' | 'svg' | 'txt'
  /**
   * server url
   */
  server?: string
  /**
   * ditaa options
   */
  ditaa?: {
    server?: string
    imageFormat?: 'png' | 'txt'
  }
  /**
   * dot options
   */
  dot?: {
    server?: string
    imageFormat?: 'png' | 'svg' | 'txt'
  }
  /**
   * plantuml options
   */
  plantuml?: {
    server?: string
    imageFormat?: 'png' | 'svg' | 'txt'
  }
  [key: string]: unknown
}

export type LangType = 'ditaa' | 'dot' | 'plantuml'

export interface EchartsOptions extends BaseOptions {
  [key: string]: unknown
}