import pandas as pd
import numpy as np
from config import TECHNICAL_CRITERIA

def calculate_amplitude(df):
    if len(df) == 0:
        return 0
    
    max_high = df['high'].max()
    min_low = df['low'].min()
    
    if min_low == 0:
        return 0
    
    return (max_high - min_low) / min_low

def is_consolidating(df, days=120, max_amplitude=0.15):
    if len(df) < days:
        return False
    
    recent_df = df.tail(days)
    amplitude = calculate_amplitude(recent_df)
    
    return amplitude <= max_amplitude

def calculate_volume_weighted_price(df):
    if len(df) == 0:
        return pd.Series()
    
    vwp = (df['close'] * df['vol']).cumsum() / df['vol'].cumsum()
    return vwp

def is_chip_concentrated(df, threshold=0.3):
    if len(df) < 60:
        return False
    
    recent_df = df.tail(60)
    
    vwp = calculate_volume_weighted_price(recent_df)
    
    if len(vwp) == 0:
        return False
    
    current_price = recent_df['close'].iloc[-1]
    
    if current_price == 0:
        return False
    
    price_diff = abs(vwp.iloc[-1] - current_price) / current_price
    
    volume_mean = recent_df['vol'].mean()
    if volume_mean == 0:
        return False
    
    volume_concentration = recent_df['vol'].std() / volume_mean
    
    return price_diff < threshold and volume_concentration < 0.5

def analyze_technical(df):
    if df.empty:
        return {
            'is_consolidating': False,
            'amplitude': 0,
            'is_chip_concentrated': False,
            'consolidation_days': 0
        }
    
    consolidation_days = TECHNICAL_CRITERIA['consolidation_days']
    max_amplitude = TECHNICAL_CRITERIA['max_amplitude']
    
    amplitude = calculate_amplitude(df.tail(consolidation_days))
    
    result = {
        'is_consolidating': is_consolidating(df, consolidation_days, max_amplitude),
        'amplitude': amplitude,
        'is_chip_concentrated': is_chip_concentrated(df),
        'consolidation_days': consolidation_days
    }
    
    return result

def technical_filter(df):
    analysis = analyze_technical(df)
    return analysis['is_consolidating'] and analysis['is_chip_concentrated']