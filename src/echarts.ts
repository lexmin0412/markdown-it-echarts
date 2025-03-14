'use strict'

import { getController } from './render-control'
import { type EchartsOptions } from './types'
import * as echarts from 'echarts'

export const functions = {
  options: {
    showController: false,
  } as EchartsOptions,

  dataMap: new Map(),

  initialize(options: EchartsOptions): void {
    if (options)
      this.options = Object.assign(this.options, options)
  },

  getMarkup (code: string): string {
    const content = removeTripleBackticks(code)

    const chartId = `echarts-${Math.random()}`
    this.dataMap.set(chartId, content)
    const html = `<div id="${chartId}" style="width:100px;height:100px;background:#ccc"></div>`

    const container = document.createElement('div')
    const div = document.createElement('div')
    div.id = chartId
    div.style.width = '100px'
    div.style.height = '100px'
    const myChart = echarts.init(div);
    const option = JSON.parse(content)
    myChart.setOption(option)
    container.appendChild(div)

    console.log('container.innerHTML', container.innerHTML)

    // const img = `<pre data-svg="${SelectorEnum.MERMAID}" class="mermaid ${SelectorEnum.IMG}">\n${content}\n</pre>\n`
    if (!this.options.showController)
      return container.innerHTML
    return getController(code, html)
  },
}

function removeTripleBackticks(inputString: string): string {
  if (inputString.endsWith('```')) {
    // Remove the last 3 characters
    return inputString.slice(0, -3)
  }
  else {
    // String doesn't end with "```", return as is
    return inputString
  }
}