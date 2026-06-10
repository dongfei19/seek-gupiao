import sys
sys.path.insert(0, '.')

import pandas as pd
import numpy as np
from technical_analyzer import calculate_amplitude, is_consolidating, is_chip_concentrated, technical_filter
from fundamental_analyzer import analyze_fundamental, fundamental_filter, evaluate_competitive_position
from config import FUNDAMENTAL_CRITERIA, TECHNICAL_CRITERIA

def test_technical_analyzer():
    print("测试技术面分析模块...")
    
    dates = pd.date_range('2023-01-01', periods=150)
    prices = np.random.uniform(10, 11.5, 150)
    volumes = np.random.uniform(100000, 200000, 150)
    
    df = pd.DataFrame({
        'trade_date': dates,
        'open': prices,
        'high': prices * 1.02,
        'low': prices * 0.98,
        'close': prices,
        'vol': volumes
    })
    
    amplitude = calculate_amplitude(df.tail(120))
    print(f"  振幅计算: {amplitude:.2%}")
    
    consolidating = is_consolidating(df, 120, 0.15)
    print(f"  盘振检测: {consolidating}")
    
    chip_concentrated = is_chip_concentrated(df)
    print(f"  筹码集中检测: {chip_concentrated}")
    
    tech_pass = technical_filter(df)
    print(f"  技术面筛选通过: {tech_pass}")
    
    return True

def test_fundamental_analyzer():
    print("测试基本面分析模块...")
    
    fundamental = {
        'net_profit': 600000000,
        'circulating_shares': 600000000,
        'eps': 2.5,
        'pe': 15,
        'industry': '半导体'
    }
    
    profit_history = [
        {'year': '2023', 'net_profit': 500000000},
        {'year': '2022', 'net_profit': 450000000},
        {'year': '2021', 'net_profit': 400000000},
        {'year': '2020', 'net_profit': 350000000},
        {'year': '2019', 'net_profit': 300000000}
    ]
    
    analysis = analyze_fundamental(fundamental, profit_history)
    print(f"  基本面分析通过: {analysis['pass']}")
    print(f"  净利润: {analysis['net_profit']/100000000:.2f}亿")
    print(f"  流通股: {analysis['circulating_shares']/100000000:.2f}亿")
    print(f"  持续盈利年数: {analysis['profitable_years']}")
    
    fund_pass = fundamental_filter(fundamental, profit_history)
    print(f"  基本面筛选通过: {fund_pass}")
    
    competitive = evaluate_competitive_position('半导体')
    print(f"  行业竞争力评估 - 护城河: {'有' if competitive['has_moat'] else '无'}")
    print(f"  板块: {competitive['sector']}")
    
    return True

def test_config():
    print("测试配置参数...")
    print(f"  最低净利润: {FUNDAMENTAL_CRITERIA['min_net_profit']/100000000:.0f}亿")
    print(f"  最低流通股: {FUNDAMENTAL_CRITERIA['min_circulating_shares']/100000000:.0f}亿")
    print(f"  最低持续盈利年数: {FUNDAMENTAL_CRITERIA['min_profit_years']}年")
    print(f"  盘振天数: {TECHNICAL_CRITERIA['consolidation_days']}天")
    print(f"  最大振幅: {TECHNICAL_CRITERIA['max_amplitude']*100:.0f}%")
    return True

def main():
    print("="*60)
    print("选股程序单元测试")
    print("="*60)
    
    tests = [
        ("配置参数测试", test_config),
        ("技术面分析测试", test_technical_analyzer),
        ("基本面分析测试", test_fundamental_analyzer)
    ]
    
    passed = 0
    failed = 0
    
    for name, test_func in tests:
        print(f"\n测试: {name}")
        print("-" * 40)
        try:
            result = test_func()
            if result:
                print("✓ 测试通过")
                passed += 1
            else:
                print("✗ 测试失败")
                failed += 1
        except Exception as e:
            print(f"✗ 测试异常: {e}")
            failed += 1
    
    print("\n" + "="*60)
    print(f"测试结果: {passed} 通过, {failed} 失败")
    print("="*60)
    
    return failed == 0

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)