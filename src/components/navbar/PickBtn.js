import React, { Component } from "react";
import { MapConsumer } from "../context/MapContext";
import Loader from "react-loader-spinner";
import { BrowserView, MobileView } from "react-device-detect";
import { delay } from "../../helper/asyncHelper";

const DEFAULT_CLASS =
  "nav-link d-flex align-items-center bg-transparent border border-white mx-3 px-2 ";

const shuffle = a => {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

class PickBtn extends Component {
  state = {
    prevChosenId: null
  };
  componentWillMount() {
    clearTimeout(this.timerId);
  }

  render() {
    return (
      <MapConsumer>
        {({
          fetched,
          restaurants,
          setCenter,
          radius,
          setZoom,
          popover,
          setPopover,
          scrollToTop,
          currentLocation,
          markers
        }) => {
          const handleClick = async e => {
            e.preventDefault();
            // console.log(markers);
            try {
              const { prevChosenId } = this.state;
              const { isOpen } = popover;
              const places = shuffle(
                restaurants.map(({ place_id: placeId, geometry }) => ({
                  placeId,
                  geometry
                }))
              );
              // const newPlaces = shuffle([...markers]);
              // console.log(newPlaces);
              // newPlaces[0].current.style.border = "solid 5px black";
              // console.log(markers[0] === newPlaces[0]);
              setPopover(null, !isOpen);
              setZoom(radius);
              setCenter(currentLocation);
              await delay(500);
              const offset = 3000 / places.length;
              places.forEach(async ({ placeId }, i) => {
                try {
                  const id = `#Popover-${placeId}`;
                  await delay(Math.log(offset * i) * i * 4);
                  document.querySelector(id).classList.add("bg-secondary");
                  document
                    .querySelector(id)
                    .closest(".RestaurantMarker").parentNode.style.zIndex = 10;
                  await delay(Math.log(offset * i) * i * 4);
                  document
                    .querySelector(id)
                    .closest(".RestaurantMarker").parentNode.style.zIndex = 4;
                  document.querySelector(id).classList.remove("bg-secondary");
                } catch (error) {
                  console.log(error);
                }
              });
              this.timerId = await delay(Math.log(3000) * places.length * 10);
              const { placeId: chosenId, geometry } = places.pop();
              const { location } = geometry;
              if (prevChosenId) {
                document
                  .querySelector(`#Popover-${prevChosenId}`)
                  .closest(".RestaurantMarker").parentNode.style.zIndex = 4;
              }
              document
                .querySelector(`#Popover-${chosenId}`)
                .closest(".RestaurantMarker").parentNode.style.zIndex = 10;
              this.setState({ prevChosenId: chosenId });
              setCenter(location);
              setZoom(200);
              await delay(500);
              await setPopover(chosenId, true);
              await scrollToTop();
            } catch (error) {
              console.log(error);
            }
          };
          return !fetched ? (
            // return true ? (
            <a className={DEFAULT_CLASS + "disabled"}>
              <Loader type="ThreeDots" color="#fff" height={60} width={60} />
            </a>
          ) : (
            <a
              className={DEFAULT_CLASS}
              onClick={handleClick}
              onMouseEnter={e => {
                e.currentTarget.classList.add("border-secondary");
              }}
              onMouseLeave={e => {
                e.currentTarget.classList.remove("border-secondary");
              }}
            >
              <BrowserView> Pick one for me</BrowserView>
              <MobileView>
                <i className="material-icons">restaurant</i>
              </MobileView>
            </a>
          );
        }}
      </MapConsumer>
    );
  }
}

export default PickBtn;
