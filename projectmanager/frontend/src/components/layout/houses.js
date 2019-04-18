import React, { useState, useEffect } from "react";
import House from "./house";
import axios from "axios";
import MapView from "./map/map";
import Search from "./search";

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [filter, setFilter] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const mapsKey = "AIzaSyCZfUHxZLHtErCuMSQgdUDvMDy0OTKoaF4";
  let userPosition = "";

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/houses/?neighboorhood=&bedrooms=&bathrooms=&property_type=`
      )
      .then(res => {
        setHouses(res.data);
        // geoList();
      });
  }, []);

  useEffect(() => {
    let tmpAddresses = [];
    let completedPromises = 0;
    houses.forEach(house => {
      axios
        .get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: {
            address: house.address,
            key: "AIzaSyCZfUHxZLHtErCuMSQgdUDvMDy0OTKoaF4"
          }
        })
        .then(function(response) {
          if (response.data.error_message) {
            console.log("Error", response);
            alert("Error");
          }
          let lat = response.data.results[0].geometry.location.lat;
          let long = response.data.results[0].geometry.location.lng;
          tmpAddresses.push({
            name: house.address,
            coord: {
              lat: lat,
              lng: long
            }
          });

          completedPromises++;
          if (completedPromises === houses.length) {
            setAddresses(tmpAddresses);
            setLoaded(true);
          }
        })
        .catch(error => {
          completedPromises++;
          console.log(error);
          alert("Error");
          if (completedPromises === houses.length) {
            setAddresses(tmpAddresses);
            setLoaded(true);
          }
        });
    });
  }, [houses]);

  const sortByPrice = e => {
    let housesCopy = houses.slice();
    setHouses(housesCopy.sort((a, b) => a.price - b.price));
  };
  const sortBySize = e => {
    let housesCopy = houses.slice();
    setHouses(housesCopy.sort((a, b) => b.sqft - a.sqft));
  };
  const sortByYear = e => {
    let housesCopy = houses.slice();
    setHouses(housesCopy.sort((a, b) => b.year_built - a.year_built));
  };

  const userLocation = e => {
    navigator.geolocation.getCurrentPosition(position => {
      userPosition = position;
      console.log(userPosition);
    });
  };

  // houses.forEach(house => {
  //   allAddress.push(house.address);
  // });
  // allAddress.forEach(address => {
  //   axios
  //     .get("https://maps.googleapis.com/maps/api/geocode/json", {
  //       params: {
  //         address: address,
  //         key: "AIzaSyCZfUHxZLHtErCuMSQgdUDvMDy0OTKoaF4"
  //       }
  //     })
  //     .then(function(response) {
  //       if (response.data.error_message) {
  //         console.log("Error", response);
  //       }
  //       let lat = response.data.results[0].geometry.location.lat;
  //       let long = response.data.results[0].geometry.location.lng;
  //       addressCol.push({
  //         name: address,
  //         coord: {
  //           lat: lat,
  //           lng: long
  //         }
  //       });

  //       console.log("sucess block of houses.js addressCol", addressCol);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // });
  // };
  //window.onload = geoList();

  return (
    <div className="all-house">
      <div className="house-list">
        <button onClick={() => sortByPrice()}>Sort By price</button>
        <button onClick={() => sortBySize()}>
          Sort By sqft {"(high to low)"}{" "}
        </button>
        <button onClick={() => sortByYear()}>
          Sort By Year{"(Newest to oldest)"}{" "}
        </button>
        <ul>
          {houses.map(home => (
            <House
              key={home.id}
              img={home.img}
              price={home.price}
              address={home.address}
              description={home.description}
              bedrooms={home.bedrooms}
              bathrooms={home.bathrooms}
              sqft={home.sqft}
              id={home.id}
            />
          ))}
        </ul>
      </div>
      {loaded && <MapView addresses={addresses} userPosition={userPosition} />}
    </div>
  );
};

export default Houses;
