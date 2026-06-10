from config import FUNDAMENTAL_CRITERIA

def analyze_fundamental(fundamental, profit_history):
    if not fundamental:
        return {
            'pass': False,
            'reasons': ['无基本面数据']
        }
    
    reasons = []
    
    min_net_profit = FUNDAMENTAL_CRITERIA['min_net_profit']
    min_circulating_shares = FUNDAMENTAL_CRITERIA['min_circulating_shares']
    min_profit_years = FUNDAMENTAL_CRITERIA['min_profit_years']
    
    if fundamental['net_profit'] < min_net_profit:
        reasons.append(f"净利润不足{min_net_profit/100000000}亿")
    
    if fundamental['circulating_shares'] < min_circulating_shares:
        reasons.append(f"流通股不足{min_circulating_shares/100000000}亿")
    
    profitable_years = sum(1 for p in profit_history if p.get('net_profit', 0) > 0)
    if profitable_years < min_profit_years:
        reasons.append(f"持续盈利年份不足{min_profit_years}年，仅{profitable_years}年")
    
    return {
        'pass': len(reasons) == 0,
        'reasons': reasons,
        'net_profit': fundamental['net_profit'],
        'circulating_shares': fundamental['circulating_shares'],
        'profitable_years': profitable_years,
        'eps': fundamental.get('eps', 0),
        'pe': fundamental.get('pe', 0),
        'industry': fundamental.get('industry', '')
    }

def fundamental_filter(fundamental, profit_history):
    analysis = analyze_fundamental(fundamental, profit_history)
    return analysis['pass']

def evaluate_competitive_position(industry):
    top_companies = {
        '半导体': ['中芯国际', '韦尔股份', '北方华创'],
        '新能源': ['宁德时代', '比亚迪', '隆基绿能'],
        '医药': ['恒瑞医药', '药明康德', '迈瑞医疗'],
        '金融': ['招商银行', '平安银行', '中信证券'],
        '消费': ['贵州茅台', '五粮液', '海天味业'],
        '科技': ['海康威视', '立讯精密', '京东方'],
        'Software': ['Microsoft', 'Apple', 'Google'],
        'Semiconductors': ['NVIDIA', 'Intel', 'AMD'],
        'Internet': ['Meta', 'Amazon', 'Netflix'],
        'Finance': ['JPMorgan', 'Visa', 'Mastercard'],
        'Healthcare': ['Johnson & Johnson', 'Pfizer', 'Merck']
    }
    
    for sector, companies in top_companies.items():
        if industry and sector in industry:
            return {'has_moat': True, 'sector': sector, 'top_companies': companies}
    
    return {'has_moat': False, 'sector': '其他', 'top_companies': []}