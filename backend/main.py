import os
import httpx
import numpy as np
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Optional

from models import SessionLocal, UserProfile, init_db
from vector_store import vector_store
from analytics import AnalyticsService, ForecastingService
from strategies import StrategyService

# Initialize DB
init_db()

# Load environment variables
load_dotenv()

app = FastAPI(title="Crypto Investment AI Agent API")

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MarketService:
    COINGECKO_URL = "https://api.coingecko.com/api/v3"

    @staticmethod
    async def get_prices(coin_ids: List[str]):
        async with httpx.AsyncClient() as client:
            ids = ",".join(coin_ids)
            response = await client.get(
                f"{MarketService.COINGECKO_URL}/simple/price",
                params={"ids": ids, "vs_currencies": "usd", "include_24hr_change": "true"}
            )
            if response.status_code != 200:
                return None
            return response.json()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ProfileUpdate(BaseModel):
    risk_tolerance: str
    investment_goal: str

class HealthResponse(BaseModel):
    status: str
    message: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    thought: str = ""

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {"status": "ok", "message": "Crypto AI Agent Backend is running"}

@app.get("/market-data")
async def get_market_data(ids: str = "bitcoin,ethereum,solana"):
    coin_ids = ids.split(",")
    data = await MarketService.get_prices(coin_ids)
    if not data:
        raise HTTPException(status_code=500, detail="Failed to fetch market data")
    return data

@app.get("/profile")
async def get_profile(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == "default_user").first()
    if not profile:
        profile = UserProfile(user_id="default_user")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.post("/profile")
async def update_profile(update: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == "default_user").first()
    if not profile:
        profile = UserProfile(user_id="default_user")
        db.add(profile)
    
    profile.risk_tolerance = update.risk_tolerance
    profile.investment_goal = update.investment_goal
    db.commit()
    return {"message": "Profile updated successfully"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    if not model:
        return {
            "response": "Gemini API Key is not configured.",
            "thought": "Configuration Error"
        }
    
    try:
        # 1. Fetch User Profile Context
        profile = db.query(UserProfile).filter(UserProfile.user_id == "default_user").first()
        user_context = f"User Profile: Risk Tolerance={profile.risk_tolerance if profile else 'Medium'}, Goal={profile.investment_goal if profile else 'Growth'}."

        # 2. Fetch Market Context (if relevant)
        market_context = ""
        if any(keyword in request.message.lower() for keyword in ["price", "market", "value", "btc", "eth", "sol"]):
            data = await MarketService.get_prices(["bitcoin", "ethereum", "solana"])
            if data and isinstance(data, dict):
                btc_price = data.get("bitcoin", {}).get("usd", "N/A")
                eth_price = data.get("ethereum", {}).get("usd", "N/A")
                sol_price = data.get("solana", {}).get("usd", "N/A")
                market_context = f"Current Market Prices: BTC: ${btc_price}, ETH: ${eth_price}, SOL: ${sol_price}."

        # 3. RAG Search
        rag_results = vector_store.search(request.message)
        rag_context = "Knowledge Context: " + " ".join(rag_results) if rag_results else ""

        # 4. Strategy Context
        strategies = StrategyService.get_dca_plan(profile.risk_tolerance if profile else "medium", 124000)
        strategy_context = f"Recommended Strategy: {strategies['type']} at {strategies['frequency']} frequency targeting {', '.join(strategies['target_assets'])}."

        prompt = f"""
        You are a modern Crypto Investment Assistant. 
        {user_context}
        {market_context}
        {rag_context}
        {strategy_context}
        
        User question: {request.message}
        """
        
        response = model.generate_content(prompt)
        return {
            "response": response.text,
            "thought": f"Integrated Profile ({profile.risk_tolerance if profile else 'Default'}) and RAG context."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/portfolio/analytics")
async def get_portfolio_analytics():
    # Mocked historical data for calculation demonstration
    # In a real app, this would be fetched from transactional history
    mock_returns = np.random.normal(0.001, 0.02, 100).tolist()
    
    return {
        "sharpe_ratio": round(AnalyticsService.calculate_sharpe_ratio(mock_returns), 2),
        "volatility": round(AnalyticsService.calculate_volatility(mock_returns), 4),
        "var_95": round(AnalyticsService.calculate_var(mock_returns), 4),
        "status": "Healthy"
    }

@app.get("/market/forecast/{coin_id}")
async def get_coin_forecast(coin_id: str):
    # Mock current price and history for demonstration
    current_prices = {"bitcoin": 65000, "ethereum": 3500, "solana": 140}
    price = current_prices.get(coin_id.lower(), 100)
    
    # Generate mock history
    history = [price * (1 + np.random.normal(0, 0.01)) for _ in range(30)]
    
    forecast = ForecastingService.simple_projection(price, history)
    return {
        "coin_id": coin_id,
        "current_price": price,
        "forecast": forecast
    }

@app.get("/portfolio/strategies")
async def get_strategies(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == "default_user").first()
    risk = profile.risk_tolerance if profile else "medium"
    
    # Mock current allocation
    current_alloc = {"BTC": 0.65, "ETH": 0.25, "SOL": 0.10}
    target_alloc = {"BTC": 0.50, "ETH": 0.30, "SOL": 0.20}
    
    dca = StrategyService.get_dca_plan(risk, 100000) # Mock balance
    signals = StrategyService.get_rebalancing_signals(current_alloc, target_alloc)
    sentiment = StrategyService.get_market_sentiment()
    
    return {
        "dca_plan": dca,
        "rebalancing_signals": signals,
        "market_sentiment": sentiment
    }

@app.get("/")
async def root():
    return {"message": "Welcome to the Crypto Investment AI Agent API"}
