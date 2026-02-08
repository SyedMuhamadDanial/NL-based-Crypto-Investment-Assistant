# Crypto Investment Assistant

This is a modern AI agent that helps you manage crypto investments. It uses real-time data and quant calculations.

## Tech Stack

*   **Next.js**: Used for building the user interface.
*   **FastAPI**: Used for creating the backend API.
*   **Python**: Used for all backend logic and data processing.
*   **SQLite**: Used for storing user profiles and settings locally.
*   **Tailwind CSS**: Used for styling the app with a modern look.

## Tools and Scenarios

*   **Gemini 1.5 Flash (Google AI)**
    *   **Scenario**: User asks a question in the chat.
    *   **Reason**: It provides smart and professional investment advice.
*   **CoinGecko API**
    *   **Scenario**: App needs to show current prices.
    *   **Reason**: It gives accurate and free real-time market data.
*   **FAISS (Facebook AI Similarity Search)**
    *   **Scenario**: Agent needs extra knowledge for a specific topic.
    *   **Reason**: It allows the AI to quickly find and use local documents.
*   **SQLAlchemy**
    *   **Scenario**: Saving user risk levels and goals.
    *   **Reason**: It makes it easy to save and load data from the database.
*   **Recharts**
    *   **Scenario**: Displaying price forecasts.
    *   **Reason**: It creates beautiful and interactive charts for the dashboard.
*   **NumPy and Pandas**
    *   **Scenario**: Calculating risk metrics like the Sharpe Ratio.
    *   **Reason**: They are very fast at handling math and data tables.
*   **Scikit-learn**
    *   **Scenario**: Predicting future price trends.
    *   **Reason**: It provides simple models for linear regression forecasting.
*   **Lucide React**
    *   **Scenario**: Adding icons to the sidebar and cards.
    *   **Reason**: It provides a clean and modern set of icons.

## Models and Performance

*   **Linear Regression Model (Scikit-Learn)**: Used for price forecasting. It analyzes price history to find a trend line for the next 7 days.
*   **Sentence-Transformers**: Used for turning text into numbers (vector embeddings). This helps the agent understand the meaning of your questions.
*   **Sharpe Ratio**: 1.84 (Current Demo Value). A higher number means better performance for the risk taken.
*   **Annual Volatility**: 31.4% (Current Demo Value). Measures how much prices jump up and down.
*   **Value at Risk (VaR 95%)**: 4.25% (Current Demo Value). Predicts the most money you might lose on a bad day.
*   **Model Accuracy**: Projections include a 5% confidence interval for price movement ranges.

## Key Achievements

*   **Smart Reasoning**: The agent uses your risk profile to give personalized advice.
*   **Live Updates**: Dashboard prices refresh automatically every 30 seconds.
*   **Real Math**: The app calculates actual risk metrics instead of using fake numbers.
*   **Actionable Advice**: The app gives clear "Buy" or "Sell" signals for rebalancing.
*   **Local Privacy**: Your profile and data are saved on your own machine in a local database.
*   **Premium Design**: The UI uses a modern "Glassmorphism" look with dark mode.
