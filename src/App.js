import { act, useEffect, useState } from "react";
import "./App.css";
import proofService from "./services/proofService";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { ethers } from "ethers";
import axios from 'axios'; // Import axios

function App() {
  const [destinationCoords, setDestinationCoords] = useState([0, 0]);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [eta, setEta] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      if (sourceCoords.length !== 2 || sourceCoords.some((c) => isNaN(Number(c)))) {
        throw new Error('Invalid source coordinates format. Please use "latitude,longitude"');
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

      console.log("2. Current location:", sourceAddress);
      console.log("3. Destination:", destinationAddress);
      console.log("4. Claimed ETA:", eta, "minutes");

      // Get actual ETA from OSRM
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${sourceLong},${sourceLat};${destLong},${destLat}`;
      const response = await fetch(osrmUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch ETA from OSRM");
      }

      const data = await response.json();
      if (!data.routes || !data.routes[0]) {
        throw new Error("No route found");
      }

      const actualETA = Math.round(data.routes[0].duration / 60); // Convert seconds to minutes
      console.log("5. Actual ETA from API:", actualETA, "minutes");

      await proofService.init();

      console.log("6. Generating zkproof...");
      const proof = await proofService.generateProof({
        sourceLatitude: sourceLat,
        sourceLongitude: sourceLong,
        claimedETA: parseInt(eta),
        actualETA: actualETA,
        tolerance: 5,
      });

      console.log("7. Proof generated:", proof);

      const verificationResult = await proofService.verifyProofOnChain(
        proof.proof,
        proof.publicSignals,
        destinationAddress
      );

      setResult({
        destination: verificationResult.destination,
        actualETA: verificationResult.actualETA,
        verified: verificationResult.verified && Math.abs(verificationResult.actualETA - parseInt(eta)) <= 5,
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="App">
      <div className="container">
        <div className="input-group">
          <AddressAutocomplete
            onSelect={(address, coords) => {
              setDestinationAddress(address);
              setDestinationCoords(coords);
            }}
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
        {error && (
          <div className="error">
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
