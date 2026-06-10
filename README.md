# 选股程序

基于技术面和基本面分析的股票筛选工具，支持中国A股和美股市场。

## 功能特性

### 技术面筛选
- 筹码集中度分析
- 120天盘振形态（15%振幅限制）

### 基本面筛选
- 净利润大于5亿
- 流通股大于5亿
- 持续盈利5年以上
- 行业竞争力评估
- 市场占有率前三
- 护城河分析

### 支持市场
- 中国A股
- 美股

## 安装依赖

```bash
pip install -r requirements.txt
```

## 配置说明

1. 在 `config.py` 中配置 Tushare token：
```python
TUSHARE_TOKEN = "your_tushare_token_here"
```

2. 获取 Tushare token：https://tushare.pro/register

## 使用方法

```bash
python stock_picker.py
```

## 项目结构

```
seek-gupiao/
├── config.py          # 配置文件
├── data_fetcher.py    # 数据获取模块
├── technical_analyzer.py  # 技术面分析模块
├── fundamental_analyzer.py # 基本面分析模块
├── stock_picker.py    # 主程序
├── requirements.txt   # 依赖列表
└── README.md          # 项目说明
```

## 筛选条件配置

在 `config.py` 中可自定义以下参数：

```python
FUNDAMENTAL_CRITERIA = {
    'min_net_profit': 500000000,      # 最低净利润（5亿）
    'min_circulating_shares': 500000000,  # 最低流通股（5亿）
    'min_profit_years': 5,             # 最低持续盈利年数
    'min_market_share_rank': 3         # 市场占有率排名
}

TECHNICAL_CRITERIA = {
    'consolidation_days': 120,         # 盘振天数
    'max_amplitude': 0.15              # 最大振幅（15%）
}
```

## 注意事项

1. A股数据依赖 Tushare API，需要注册账号并获取 token
2. 美股数据使用 Yahoo Finance，无需 API key
3. 网络请求可能受限制，请合理控制请求频率
4. 本程序仅供研究参考，不构成投资建议