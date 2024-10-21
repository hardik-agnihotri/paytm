import { useState, useEffect } from "react";
import axios from "axios";
import { Appbar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);  // Initialize balance with 0

  useEffect(() => {
    // Function to fetch the balance from the backend
    const fetchBalance = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/bank/balance", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        setBalance(response.data.balance);  // Update the state with the fetched balance
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    // Fetch the balance initially
    fetchBalance();

    // Polling: Fetch the balance every 5 seconds
    const intervalId = setInterval(fetchBalance, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />  {/* Pass the balance as a prop */}
        <Users />
      </div>
    </div>
  );
};