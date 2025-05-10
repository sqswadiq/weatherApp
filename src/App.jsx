import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import myImage from "./assets/color.jpg";
import './App.css'
import { IoSunny } from "react-icons/io5";
import { IoIosCloud } from "react-icons/io";


const bgUrl =
  "https://pplx-res.cloudinary.com/image/private/user_uploads/68369657/8fbb68b6-a502-4379-bca8-14c8db2e15c8/image.jpg";

function App() {
  const [weather, setWeather] = useState(null);
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const apiKey = "9e695b46c77f932190a56cf92dc45cef";
  const cities = ["Delhi", "Sydney", "Moscow", "paris", "Newyork"];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);



  const fetchWeather = async (city) => {
    try {

      const response = await axios.get(
        // base url 
        `https://weatherbackend-h6pj.onrender.com/api/weather/current?city=${city}`
      );

      const response2 = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=9e695b46c77f932190a56cf92dc45cef&units=metric`
      );

      console.log("response2response2", response2.data);

      console.log("response.data", response.data.temperature);
      setTemp(response?.data);
      setWeather(response2.data);
    } catch (err) {
      console.error("Axios Error:", err);
      setError(err.response?.data || "An unexpected error occurred");
    }
  };

  function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  }

  // Example usage:
  const time = convertTimestampToTime(weather?.city?.sunset);
  console.log("time", time); // Output: "06:00 PM"

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);

    const day = date.getDate(); // Get day of the month
    const month = date.toLocaleString("default", { month: "short" }); // Get month name (short form)
    const year = date.getFullYear(); // Get full year

    return `${day} ${month} ${year}`;
  }

  // Handle city selection change
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    fetchWeather(city);
  };

  const formattedDate = formatDate(temp?.date);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, []);

  return (
    <div
      className="container p-4 pb-5 d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `(${myImage})`,
        minHeight: "100vh",
        alignItems: "center"
      }}
    >
      <div
        className="container"
        style={{
          // background: "rgba(255,255,255,0.7)",
          background: `url('https://images.unsplash.com/photo-1490735891913-40897cdaafd1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3Vuc2V0JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D') center/cover no-repeat`,
          borderRadius: "2rem",
          maxWidth: 900,
          padding: "2rem",
          textAlign: "center"
        }}
      >
        <div className="row g-4 align-items-stretch justify-content-center align-items-center">
          {/* Left Weather Card */}
          <div className="col-md-5">
            <div
              className="h-100 d-flex flex-column justify-content-between p-4"
              style={{
                background: "#fee1b7",
                borderRadius: "2rem",
                minHeight: 340,
              }}
            >

              

              <div>

                <div className="d-flex justify-content-center">
                  <div className="me-4" style={{
                    position: "relative"
                  }}>
                    <select
                      className="form-select outline outline-0 border border-0 text-warning fw-bold"
                      value={selectedCity}
                      onChange={handleCityChange}

                      style={{
                        background: "#fee1b7", // Light background color
                        // Subtle shadow for depth
                        cursor: "pointer",
                        fontSize: "1.25rem",
                        paddingLeft: "8px", // Added some padding
                        width: "auto",
                      }}

                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <i style={{ position: "absolute", bottom: 10, right: "10px" }} class="fa-solid fa-angle-down text-warning"></i>
                  </div>
                </div>


                <div className="d-flex justify-content-center align-items-center  mb-2">
                  <IoSunny size={80} className="text-warning" />
                  <span className="display-2 fw-bold text-warning " >
                    {temp?.temperature}°
                  </span>

                </div>
                <div className="text-warning fw-semibold fs-5 mb-2">
                  {temp?.description}
                </div>
                <div className="text-warning mb-1">{temp?.location}</div>
                <div
                  className="text-warning mb-2"
                  style={{ fontSize: "0.95rem" }}
                >
                  {formattedDate}
                </div>
              </div>
              <div className="text-warning small mt-3">
                Feels like{" "}
                {temp?.temperature ? Math.floor(temp.temperature) - 2 : ""}{" "}
                &nbsp; | &nbsp; Sunrise{" "}
                {convertTimestampToTime(weather?.city?.sunrise)}
              </div>
            </div>
          </div>

          {/* Right Side: Forecast and Text */}
          <div className="col-sm-7 d-flex flex-column">
            {/* Hourly Forecast */}
            <div
              className="p-3 transparent"
              style={{
                borderRadius: "15px"
              }}
            >
              <div className="d-flex justify-content-center small text-light">
                <div className="mx-1">
                  <div>Now</div>
                  <div className="d-flex align-items-center"><IoIosCloud size={20} className="me-1" />{temp?.temperature}°</div>
                </div>
                {weather?.list.slice(0, 4).map((time, index) => (
                  <div className="mx-1" key={index}>
                    {console.log("time", time)}

                    <div>{convertTimestampToTime(time?.dt)}</div>
                    <div><IoIosCloud size={20} className="me-1" />{time?.main?.temp}°</div>
                  </div>
                ))}
              </div>
              <hr className="mx-3"/>
              <div className="d-flex justify-content-center small text-light mt-2">

                {weather?.list.slice(5, 10).map((time, index) => (
                  <div className="mx-1" key={index}>
                    {console.log("time", time)}

                    <div>{convertTimestampToTime(time?.dt)}</div>
                    <div className="d-flex align-items-center"><IoIosCloud size={20} className="me-1" />{time?.main?.temp}°</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Random Text */}
            <div className="fw-bold fs-5 my-2 text-start my-4 text-light">Random Text</div>
            <div>
              <div className="small text-start text-light">
                Improve him believe opinion offered met and end cheered forbade. Friendly as stronger speedily by recurred. Son interest wandered sir addition end say. Manners beloved affixed picture men ask.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
