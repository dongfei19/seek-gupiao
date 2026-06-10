import tushare as ts
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from config import TUSHARE_TOKEN

try:
    ts.set_token(TUSHARE_TOKEN)
    pro = ts.pro_api()
except Exception as e:
    print(f"Tushare初始化失败: {e}")
    pro = None

def get_a_share_list():
    if pro is None:
        print("Tushare未初始化，无法获取A股数据")
        return pd.DataFrame()
    
    try:
        data = pro.stock_basic(exchange='', list_status='L', fields='ts_code,symbol,name,industry,list_date')
        return data
    except Exception as e:
        print(f"获取A股列表失败: {e}")
        return pd.DataFrame()

def get_a_share_daily_data(ts_code, start_date, end_date):
    try:
        df = pro.daily(ts_code=ts_code, start_date=start_date, end_date=end_date)
        df['trade_date'] = pd.to_datetime(df['trade_date'], format='%Y%m%d')
        df = df.sort_values('trade_date')
        return df
    except Exception as e:
        print(f"获取A股{ts_code}日线数据失败: {e}")
        return pd.DataFrame()

def get_a_share_fundamental(ts_code):
    try:
        fina = pro.fina_indicator(ts_code=ts_code)
        if len(fina) == 0:
            return None
        
        latest = fina.iloc[0]
        shares = pro.stock_share(ts_code=ts_code)
        
        fundamental = {
            'ts_code': ts_code,
            'net_profit': latest.get('profit', 0),
            'circulating_shares': shares.iloc[0].get('float_share', 0) * 10000 if len(shares) > 0 else 0,
            'eps': latest.get('eps', 0),
            'pe': latest.get('pe', 0),
            'industry': ''
        }
        return fundamental
    except Exception as e:
        print(f"获取A股{ts_code}基本面数据失败: {e}")
        return None

def get_a_share_profit_history(ts_code, years=5):
    try:
        fina = pro.fina_indicator(ts_code=ts_code)
        if len(fina) == 0:
            return []
        
        fina = fina.sort_values('end_date', ascending=False)
        profit_history = []
        
        for _, row in fina.head(years).iterrows():
            profit_history.append({
                'year': row['end_date'][:4],
                'net_profit': row.get('profit', 0)
            })
        
        return profit_history
    except Exception as e:
        print(f"获取A股{ts_code}盈利历史失败: {e}")
        return []

def get_us_stock_list():
    try:
        tickers = yf.Tickers(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'JNJ', 'V', 'WMT', 'PG', 'MA', 'UNH', 'HD', 'DIS', 'BAC', 'CMCSA', 'XOM', 'PFE'])
        stocks = []
        for ticker, info in tickers.tickers.items():
            try:
                stocks.append({
                    'ticker': ticker,
                    'name': info.info.get('shortName', ''),
                    'industry': info.info.get('industry', '')
                })
            except:
                continue
        return pd.DataFrame(stocks)
    except Exception as e:
        print(f"获取美股列表失败: {e}")
        return pd.DataFrame()

def get_us_stock_daily_data(ticker, period='1y'):
    try:
        df = yf.download(ticker, period=period)
        df = df.reset_index()
        df.rename(columns={'Date': 'trade_date', 'Open': 'open', 'High': 'high', 'Low': 'low', 'Close': 'close', 'Volume': 'vol'}, inplace=True)
        return df
    except Exception as e:
        print(f"获取美股{ticker}日线数据失败: {e}")
        return pd.DataFrame()

def get_us_stock_fundamental(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        fundamental = {
            'ticker': ticker,
            'net_profit': info.get('netIncomeToCommon', 0),
            'circulating_shares': info.get('floatShares', 0),
            'eps': info.get('trailingEps', 0),
            'pe': info.get('trailingPE', 0),
            'industry': info.get('industry', '')
        }
        return fundamental
    except Exception as e:
        print(f"获取美股{ticker}基本面数据失败: {e}")
        return None

def get_us_stock_profit_history(ticker, years=5):
    try:
        stock = yf.Ticker(ticker)
        financials = stock.financials
        
        if financials.empty:
            return []
        
        profit_history = []
        for year in financials.columns[:years]:
            net_income = financials.loc['Net Income', year] if 'Net Income' in financials.index else 0
            profit_history.append({
                'year': year.year,
                'net_profit': net_income
            })
        
        return profit_history
    except Exception as e:
        print(f"获取美股{ticker}盈利历史失败: {e}")
        return []