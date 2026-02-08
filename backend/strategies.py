from typing import List, Dict
import numpy as np

class StrategyService:
    @staticmethod
    def get_dca_plan(risk_profile: str, current_balance: float) -> Dict:
        """Generates a Dollar Cost Averaging plan."""
        risk_map = {
            "low": {"frequency": "Weekly", "amount_ratio": 0.05, "assets": ["BTC", "ETH", "USDC"]},
            "medium": {"frequency": "Bi-weekly", "amount_ratio": 0.10, "assets": ["BTC", "ETH", "SOL", "LINK"]},
            "high": {"frequency": "Daily", "amount_ratio": 0.15, "assets": ["BTC", "ETH", "SOL", "PEPE", "RNDR"]}
        }
        
        config = risk_map.get(risk_profile.lower(), risk_map["medium"])
        amount = current_balance * config["amount_ratio"]
        
        return {
            "type": "Dollar Cost Averaging (DCA)",
            "frequency": config["frequency"],
            "recommended_amount": round(amount, 2),
            "target_assets": config["assets"],
            "rationale": f"Based on your {risk_profile} risk profile, we suggest a {config['frequency']} entry to minimize volatility impact."
        }

    @staticmethod
    def get_rebalancing_signals(current_alloc: Dict[str, float], target_alloc: Dict[str, float]) -> List[Dict]:
        """Generates rebalancing signals if allocations deviate from targets."""
        signals = []
        for asset, target in target_alloc.items():
            current = current_alloc.get(asset, 0)
            deviation = current - target
            
            if abs(deviation) > 0.05:  # 5% threshold
                action = "SELL" if deviation > 0 else "BUY"
                signals.append({
                    "asset": asset,
                    "action": action,
                    "deviation_pct": round(deviation * 100, 2),
                    "message": f"{action} {asset} to reach target allocation of {target*100}%"
                })
        return signals

    @staticmethod
    def get_market_sentiment() -> Dict:
        """Mocked market sentiment analysis."""
        return {
            "score": 65,
            "label": "Greed",
            "trend": "Bullish",
            "suggestion": "Market is showing strength. Continue DCA but avoid lump-sum entries at local peaks."
        }
