// src/mockData.js
export const mockCategories = [
  // 支出分类
  {
    id: 1,
    categoryName: "餐饮美食",
    type: "expense",
    icon: "shop",
    color: "#FF6B6B"
  },
  {
    id: 2,
    categoryName: "交通出行",
    type: "expense",
    icon: "car",
    color: "#4D8AF0"
  },
  {
    id: 3,
    categoryName: "生活日用",
    type: "expense",
    icon: "cart",
    color: "#FFA940"
  },
  {
    id: 4,
    categoryName: "服饰美容",
    type: "expense",
    icon: "bag",
    color: "#FF85C0"
  },
  {
    id: 5,
    categoryName: "住房物业",
    type: "expense",
    icon: "home",
    color: "#5CDBD3"
  },

  // 收入分类
  {
    id: 6,
    categoryName: "工资收入",
    type: "income",
    icon: "medal",
    color: "#73D13D"
  },
  {
    id: 7,
    categoryName: "投资收益",
    type: "income",
    icon: "moneybags",
    color: "#FFC53D"
  },
  {
    id: 8,
    categoryName: "兼职收入",
    type: "income",
    icon: "staff",
    color: "#597EF7"
  }
]

export const mockTags = [
  // 餐饮美食的标签
  { id: 101, tagName: "早餐", categoryId: 1 },
  { id: 102, tagName: "午餐", categoryId: 1 },
  { id: 103, tagName: "晚餐", categoryId: 1 },
  { id: 104, tagName: "零食", categoryId: 1 },
  { id: 105, tagName: "早餐", categoryId: 1 },
  { id: 106, tagName: "午餐", categoryId: 1 },
  { id: 107, tagName: "晚餐", categoryId: 1 },
  { id: 108, tagName: "零食", categoryId: 1 },

  // 交通出行的标签
  { id: 201, tagName: "公共交通", categoryId: 2 },
  { id: 202, tagName: "打车", categoryId: 2 },
  { id: 203, tagName: "加油", categoryId: 2 },

  // 生活日用的标签
  { id: 301, tagName: "日用品", categoryId: 3 },
  { id: 302, tagName: "水电费", categoryId: 3 },
  { id: 303, tagName: "话费网费", categoryId: 3 },

  // 服饰美容的标签
  { id: 401, tagName: "服装", categoryId: 4 },
  { id: 402, tagName: "化妆品", categoryId: 4 },
  { id: 403, tagName: "理发", categoryId: 4 },

  // 住房物业的标签
  { id: 501, tagName: "房租", categoryId: 5 },
  { id: 502, tagName: "物业费", categoryId: 5 },
  { id: 503, tagName: "维修", categoryId: 5 },

  // 工资收入的标签
  { id: 601, tagName: "月薪", categoryId: 6 },
  { id: 602, tagName: "奖金", categoryId: 6 },

  // 投资收益的标签
  { id: 701, tagName: "股票", categoryId: 7 },
  { id: 702, tagName: "基金", categoryId: 7 },

  // 兼职收入的标签
  { id: 801, tagName: "设计", categoryId: 8 },
  { id: 802, tagName: "翻译", categoryId: 8 }
]
