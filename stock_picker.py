import pandas as pd
from data_fetcher import *
from technical_analyzer import technical_filter, analyze_technical
from fundamental_analyzer import fundamental_filter, analyze_fundamental, evaluate_competitive_position
from config import MARKETS

def pick_a_shares(sample_size=50):
    print("开始筛选A股...")
    
    stock_list = get_a_share_list()
    if stock_list.empty:
        print("未能获取A股列表")
        return []
    
    results = []
    
    sample_stocks = stock_list.head(sample_size)
    
    for _, row in sample_stocks.iterrows():
        ts_code = row['ts_code']
        name = row['name']
        industry = row.get('industry', '')
        
        print(f"分析股票: {name} ({ts_code})")
        
        daily_data = get_a_share_daily_data(ts_code, '20230101', '20240101')
        
        if daily_data.empty:
            continue
        
        tech_pass = technical_filter(daily_data)
        
        if not tech_pass:
            continue
        
        fundamental = get_a_share_fundamental(ts_code)
        
        if not fundamental:
            continue
        
        profit_history = get_a_share_profit_history(ts_code)
        fund_pass = fundamental_filter(fundamental, profit_history)
        
        if not fund_pass:
            continue
        
        tech_analysis = analyze_technical(daily_data)
        fund_analysis = analyze_fundamental(fundamental, profit_history)
        competitive = evaluate_competitive_position(industry)
        
        results.append({
            'code': ts_code,
            'name': name,
            'industry': industry,
            'amplitude': tech_analysis['amplitude'],
            'net_profit': fund_analysis['net_profit'],
            'circulating_shares': fund_analysis['circulating_shares'],
            'profitable_years': fund_analysis['profitable_years'],
            'eps': fund_analysis['eps'],
            'pe': fund_analysis['pe'],
            'has_moat': competitive['has_moat'],
            'sector': competitive['sector']
        })
    
    return results

def pick_us_stocks():
    print("开始筛选美股...")
    
    stock_list = get_us_stock_list()
    if stock_list.empty:
        print("未能获取美股列表")
        return []
    
    results = []
    
    for _, row in stock_list.iterrows():
        ticker = row['ticker']
        name = row['name']
        industry = row.get('industry', '')
        
        print(f"分析股票: {name} ({ticker})")
        
        daily_data = get_us_stock_daily_data(ticker, period='2y')
        
        if daily_data.empty:
            continue
        
        tech_pass = technical_filter(daily_data)
        
        if not tech_pass:
            continue
        
        fundamental = get_us_stock_fundamental(ticker)
        
        if not fundamental:
            continue
        
        profit_history = get_us_stock_profit_history(ticker)
        fund_pass = fundamental_filter(fundamental, profit_history)
        
        if not fund_pass:
            continue
        
        tech_analysis = analyze_technical(daily_data)
        fund_analysis = analyze_fundamental(fundamental, profit_history)
        competitive = evaluate_competitive_position(industry)
        
        results.append({
            'code': ticker,
            'name': name,
            'industry': industry,
            'amplitude': tech_analysis['amplitude'],
            'net_profit': fund_analysis['net_profit'],
            'circulating_shares': fund_analysis['circulating_shares'],
            'profitable_years': fund_analysis['profitable_years'],
            'eps': fund_analysis['eps'],
            'pe': fund_analysis['pe'],
            'has_moat': competitive['has_moat'],
            'sector': competitive['sector']
        })
    
    return results

def generate_report(results, market):
    if not results:
        print(f"{MARKETS[market]}未找到符合条件的股票")
        return
    
    df = pd.DataFrame(results)
    
    print(f"\n{'='*60}")
    print(f"{MARKETS[market]}选股结果")
    print(f"{'='*60}")
    print(f"共找到 {len(results)} 只符合条件的股票")
    print("-"*60)
    
    for i, stock in enumerate(results, 1):
        print(f"\n{i}. {stock['name']} ({stock['code']})")
        print(f"   行业: {stock['industry']}")
        print(f"   振幅: {stock['amplitude']:.2%}")
        print(f"   净利润: {stock['net_profit']/100000000:.2f}亿")
        print(f"   流通股: {stock['circulating_shares']/100000000:.2f}亿")
        print(f"   持续盈利: {stock['profitable_years']}年")
        print(f"   EPS: {stock['eps']:.2f}")
        print(f"   PE: {stock['pe']:.2f}")
        print(f"   护城河: {'有' if stock['has_moat'] else '无'}")
        print(f"   板块: {stock['sector']}")
    
    output_file = f"{market}_stock_pick_result.csv"
    df.to_csv(output_file, index=False, encoding='utf-8-sig')
    print(f"\n结果已保存到: {output_file}")

def main():
    print("="*60)
    print("选股程序 v1.0")
    print("="*60)
    
    while True:
        print("\n请选择市场:")
        print("1. A股")
        print("2. 美股")
        print("3. 全部")
        print("4. 退出")
        
        choice = input("请输入选项 (1-4): ")
        
        if choice == '1':
            results = pick_a_shares()
            generate_report(results, 'a_share')
        elif choice == '2':
            results = pick_us_stocks()
            generate_report(results, 'us_stock')
        elif choice == '3':
            print("\n正在筛选A股...")
            a_share_results = pick_a_shares()
            generate_report(a_share_results, 'a_share')
            
            print("\n正在筛选美股...")
            us_stock_results = pick_us_stocks()
            generate_report(us_stock_results, 'us_stock')
        elif choice == '4':
            print("退出程序")
            break
        else:
            print("无效选项，请重新输入")

if __name__ == '__main__':
    main()