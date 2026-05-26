export const CATEGORIES = ['算法', '408', '数学', '开发'] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  算法: '数据结构与算法学习笔记。',
  '408': '计算机考研 408 复习记录。',
  数学: '数学相关学习与思考。',
  开发: '工程实践、工具与项目记录。'
};
