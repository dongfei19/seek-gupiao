# 智能选股系统

基于技术面和基本面分析的股票筛选工具，支持中国A股和美股市场，提供Web界面进行账号管理和条件配置。

## 功能特性

### Web界面功能
- **账号管理**：用户注册、登录、个人信息管理
- **选股条件设置**：可视化调整技术面和基本面筛选参数
- **选股结果展示**：股票列表、搜索、排序、收藏功能
- **实时数据展示**：股票价格、涨跌幅、振幅等指标

### 技术面筛选
- 筹码集中度分析
- 120天盘振形态（可调整振幅阈值）

### 基本面筛选
- 净利润门槛（可调整）
- 流通股门槛（可调整）
- 持续盈利年限（可调整）
- 行业竞争力评估
- 护城河分析

### 支持市场
- 中国A股
- 美股

## 项目结构

```
seek-gupiao/
├── frontend/              # React前端
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── services/      # API服务
│   │   └── store.ts       # 状态管理
│   └── package.json
├── api/                   # Express后端
│   ├── routes/            # API路由
│   ├── middleware/        # 中间件
│   ├── models/           # 数据模型
│   └── server.js         # 入口文件
├── documents/            # 项目文档
│   ├── PRD.md            # 产品需求文档
│   └── 技术架构.md        # 技术架构文档
├── python/               # Python选股核心
├── install.bat           # 安装脚本
├── dev.bat               # 开发模式启动脚本
└── README.md
```

## 快速开始

### 方式一：使用安装脚本

1. 双击运行 `install.bat` 安装依赖
2. 双击运行 `dev.bat` 启动开发服务器
3. 访问 http://localhost:5173

### 方式二：手动安装

#### 1. 安装前端依赖
```bash
cd frontend
npm install
```

#### 2. 安装后端依赖
```bash
cd api
npm install
```

#### 3. 启动服务
```bash
# 终端1：启动后端 (端口3001)
cd api
npm start

# 终端2：启动前端 (端口5173)
cd frontend
npm run dev
```

#### 4. 访问应用
打开浏览器访问：http://localhost:5173

## 配置说明

### Tushare Token（A股数据）
1. 注册 Tushare 账号：https://tushare.pro/register
2. 获取 Token
3. 更新配置：
   - 前端：`frontend/src/services/api.ts`
   - 后端：暂无（待集成Python选股核心）

### 数据库
SQLite数据库自动创建在 `api/data/database.db`

## 筛选条件配置

### 技术面参数
| 参数 | 默认值 | 说明 |
|------|--------|------|
| 盘振天数 | 120天 | 统计区间天数 |
| 最大振幅 | 15% | 区间内最高/最低价差百分比 |
| 筹码集中度 | 30% | 成交量加权价格偏离阈值 |

### 基本面参数
| 参数 | 默认值 | 说明 |
|------|--------|------|
| 最低净利润 | 5亿元 | 公司年度净利润门槛 |
| 最低流通股 | 5亿股 | 流通股数量门槛 |
| 持续盈利年限 | 5年 | 连续盈利的年数 |

## 技术栈

- **前端**：React 18 + TypeScript + Vite + TailwindCSS + Zustand
- **后端**：Express.js + SQLite + JWT + bcrypt
- **Python核心**：tushare + yfinance + pandas

## 注意事项

1. A股数据依赖 Tushare API，需要注册账号并获取 token
2. 美股数据使用 Yahoo Finance，无需 API key
3. 本程序仅供研究参考，不构成投资建议
4. 请妥善保管您的账号密码和API Token