import React, { useState } from "react";
import "./App.css";

function App() {
    const [toppingName, setToppingName] = useState("");
    const [toppingMetrics, setToppingMetrics] = useState(null);
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const fetchToppingMetrics = () => {
        const eventSource = new EventSource(
            `${apiUrl}/metrics/${toppingName}`
        );

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);
            setToppingMetrics(data);
        };

        eventSource.onerror = (error) => {
            console.error("Error fetching topping metrics:", error);
        };
    };


    return (
        <div className="App">
            <h1>Topping Metrics</h1>
            <input
                type="text"
                value={toppingName}
                onChange={(e) => setToppingName(e.target.value)}
                placeholder="Enter topping name"
            />
            <button onClick={fetchToppingMetrics}>Get Metrics</button>
            {toppingMetrics && (
                <div>
                    <h2>Results for {toppingName}:</h2>
                    <p>Total Count Per Topping: {toppingMetrics.totalCountPerTopping}</p>
                    <p>Unique User Count Per Topping: {toppingMetrics.uniqueUserCountPerTopping}</p>
                    <p>Most Popular Toppings: {toppingMetrics.mostPopularToppings.join(", ")}</p>
                    <p>Least Popular Toppings: {toppingMetrics.leastPopularToppings.join(", ")}</p>
                </div>
            )}
        </div>
    );
}

export default App;
