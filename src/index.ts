import MarkdownIt from 'markdown-it';
import * as echarts from 'echarts';

// 定义一个计数器
let chartIdCounter = 0;
// 存储已初始化的 ECharts 实例
const chartInstances = new Map<string, echarts.ECharts>();
// 存储已解析的 ECharts 配置
const parsedOptions = new Map<string, any>();

// 定义 markdown-it 插件
const markdownItEcharts = (md: MarkdownIt) => {
  // 保存原始的代码块渲染器
  const defaultFenceRenderer = md.renderer.rules.fence;

  // 重写代码块渲染规则
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const lang = token.info.trim();

    // 检查是否为 echarts 代码块
    if (lang === 'echarts') {
      try {
        // 检查是否已经解析过该配置
        let option = parsedOptions.get(token.content);
        if (!option) {
          // 解析代码块中的 JSON 配置
          option = JSON.parse(token.content);
          parsedOptions.set(token.content, option);
        }

        // 检查是否已经创建过该图表
        const existingChartId = Array.from(chartInstances.keys()).find(id => {
          const existingOption = parsedOptions.get(chartInstances.get(id)!.getOption() as any);
          // 修改比较逻辑，使用 isEqual 函数
          return isEqual(existingOption, option);
        });

        const containerId = existingChartId || `echarts-${chartIdCounter++}`;

        const html = `<div id="${containerId}" style="width: 100%; height: 400px; padding: 0.75rem 0;"></div>`;

        if (!existingChartId) {
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                const container = document.getElementById(containerId);
                if (container) {
                  let myChart = chartInstances.get(containerId);
                  if (!myChart) {
                    myChart = echarts.init(container);
                    chartInstances.set(containerId, myChart);
                    console.log('setOption', option);
                    myChart.setOption(option);
                  }
                  observer.disconnect();
                }
              }
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });
        }

        return html;
      } catch (error) {
        // 解析失败，返回原始代码块
        return defaultFenceRenderer!(tokens, idx, options, env, self);
      }
    }

    // 不是 echarts 代码块，使用默认渲染器
    return defaultFenceRenderer!(tokens, idx, options, env, self);
  };
};

export default markdownItEcharts;

// 辅助函数，用于递归比较两个对象是否相等
function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}