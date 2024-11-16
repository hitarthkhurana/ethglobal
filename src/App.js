import { act, useEffect, useState } from "react";
import "./App.css";
import proofService from "./services/proofService";
import { ethers } from "ethers";
import axios from 'axios'; // Import axios

function App() {
  const [destinationAddress, setDestinationAddress] = useState("");
  const [eta, setEta] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Get location automatically when app loads
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSourceAddress(`${latitude},${longitude}`);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const handleSubmit = async () => {
    console.log("1. ZKETA button pressed");

    if (!destinationAddress || !eta || !sourceAddress) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // Parse source coordinates
      const sourceCoords = sourceAddress.split(",").map((s) => s.trim());
      if (
        sourceCoords.length !== 2 ||
        sourceCoords.some((c) => isNaN(Number(c)))
      ) {
        throw new Error(
          'Invalid source coordinates format. Please use "latitude,longitude"'
        );
      }
      const [sourceLat, sourceLong] = sourceCoords.map(Number);

      // Parse destination coordinates
      const destCoords = destinationAddress.split(",").map((s) => s.trim());
      if (destCoords.length !== 2 || destCoords.some((c) => isNaN(Number(c)))) {
        throw new Error(
          'Invalid destination coordinates format. Please use "latitude,longitude"'
        );
      }
      const [destLat, destLong] = destCoords.map(Number);

      console.log("2. Current location:", sourceCoords);
      console.log("3. Destination:", destCoords);
      console.log("4. Claimed ETA:", eta, "minutes");

      // Get actual ETA from OpenRouteService
      const response = await fetch(
        "https://api.openrouteservice.org/v2/matrix/driving-car",
        {
          method: "POST",
          headers: {
            Accept:
              "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Content-Type": "application/json",
            Authorization:
              "5b3ce3597851110001cf6248f6a80aa9f7184e35b34439bb3a5586e1",
          },
          body: JSON.stringify({
            locations: [
              [sourceLong, sourceLat],
              [destLong, destLat],
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ETA from OpenRouteService");
      }

      const data = await response.json();
      const actualETA = Math.round(data.durations[0][1] / 60); // Convert seconds to minutes

      console.log("5. Actual ETA from API:", actualETA, "minutes");

      await proofService.init();

      console.log("6. Generating zkproof...");

      console.log(parseInt(actualETA));
      console.log(12171);
      const proof = await proofService.generateProof({
        sourceLocation: [sourceLat, sourceLong],
        claimedETA: parseInt(eta),
        actualETA: 999,
        tolerance: 5,
      });

      console.log("7. Proof generated:", proof);

      const verificationResult = await proofService.verifyProofOnChain(
        proof.proof,
        proof.publicSignals,
        destinationAddress
      );

      console.log("verificationResult >>> ", verificationResult);

      setResult({
        destination: verificationResult.destination,
        actualETA: verificationResult.actualETA,
        verified: verificationResult.verified,
      });
      // Trigger the Python backend to send a Telegram message if verified
      console.log("Triggering Python backend to send Telegram message...");
      
      // Send a POST request to the Python backend
      await axios.post('http://localhost:5001/trigger-telegram-message', {
        verified: verificationResult.verified,
        destination: destinationAddress
      })
      .then(response => {
        console.log("Telegram bot response:", response.data);
      })
      .catch(error => {
        console.error("Error triggering Python backend:", error);
      });

    } catch (error) {
      console.error("ERROR:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="App">
      <div className="container">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your destination address"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="number"
            placeholder="Enter your ETA (in minutes)"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
          />
        </div>
        <button
          className="neon-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "zkETA"}
        </button>

        {result && (
          <div className="result">
            <h3>Verification Result:</h3>
            <p>Destination: {result.destination}</p>
            <p>Actual ETA: {result.actualETA} minutes</p>
            <p>Verified: {result.verified ? "✅" : "❌"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
