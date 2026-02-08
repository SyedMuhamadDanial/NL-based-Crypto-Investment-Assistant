import numpy as np
import pandas as pd
from typing import List, Dict

class AnalyticsService:
    @staticmethod
    def calculate_sharpe_ratio(returns: List[float], risk_free_rate: float = 0.02) -> float:
        """Calculates the Sharpe ratio given a list of returns."""
        if not returns or len(returns) < 2:
            return 0.0
        returns_array = np.array(returns)
        avg_return = np.mean(returns_array)
        std_dev = np.std(returns_array)
        if std_dev == 0:
            return 0.0
        return (avg_return - risk_free_rate / 252) / std_dev * np.sqrt(252)

    @staticmethod
    def calculate_volatility(returns: List[float]) -> float:
        """Calculates annualized volatility."""
        if not returns or len(returns) < 2:
            return 0.0
        return np.std(returns) * np.sqrt(252)

    @staticmethod
    def calculate_var(returns: List[float], confidence_level: float = 0.95) -> float:
        """Calculates Value at Risk (VaR)."""
        if not returns:
            return 0.0
        return np.percentile(returns, (1 - confidence_level) * 100)

class ForecastingService:
    @staticmethod
    def simple_projection(current_price: float, history: List[float], days: int = 7) -> List[Dict]:
        """Simple linear projection based on historical trend."""
        if not history or len(history) < 2:
            # Fallback if no history
            return [{"day": i+1, "price": current_price * (1 + 0.001 * (i+1))} for i in range(days)]
        
        y = np.array(history)
        x = np.arange(len(history)).reshape(-1, 1)
        
        from sklearn.linear_model import LinearRegression
        model = LinearRegression()
        model.fit(x, y)
        
        projections = []
        last_x = len(history) - 1
        for i in range(1, days + 1):
            pred = model.predict([[last_x + i]])[0]
            projections.append({
                "day": i,
                "price": float(pred),
                "lower": float(pred * 0.95),
                "upper": float(pred * 1.05)
            })
        return projections
