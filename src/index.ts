import type { PluginWithOptions } from 'markdown-it'
import { EchartsOptions } from './types'
import { functions as echartsFunctions } from './echarts'

const MarkdownItEcharts: PluginWithOptions<EchartsOptions> = (md, options = {}) => {
  echartsFunctions.initialize(options)

  const defaultRenderer = md.renderer.rules.fence!.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
    let langName = ''
    if (info)
      langName = info.split(/\s+/g)[0]

    console.log('langNamelangName', langName)

    switch (langName) {
      case 'echarts':
        return echartsFunctions.getMarkup(code)
    }
    return defaultRenderer(tokens, idx, options, env, slf)
  }
}

export default MarkdownItEcharts