import React from "react";
import { compose, withState, lifecycle } from "recompose";
import { repeat } from "../../helper/asyncHelper";
import {
  getTodayHours,
  calcRemainingTime
} from "../../helper/remainingTimeHelper";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { RestConsumer } from "../context/RestContext";
import Photos from "./Photos";

const DEFAULT_MESSAGE = "Not available";

const anchorTagStyle = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap"
};
const wrapperClass = "d-flex justify-content-start align-items-center mb-3 ";
const placeSearchURL = placeId =>
  `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;

const enhence = compose(
  withState("remainingTime", "setRemainingTime", ""),
  withState("timerId", "setTimerId", null),
  lifecycle({
    async componentDidMount() {
      const { schedule, setRemainingTime, setTimerId } = this.props;
      const businessHours = getTodayHours(schedule);
      const edgeCases = ["Not available", "Open 24 hours"];
      if (edgeCases.includes(businessHours)) {
        setRemainingTime(businessHours);
      } else {
        try {
          const timerId = await repeat(
            () => setRemainingTime(calcRemainingTime(businessHours)),
            1000
          );
          await setTimerId(timerId);
        } catch (error) {
          console.log(error);
        }
      }
    },
    componentWillUnmount() {
      const { timerId } = this.props;
      clearInterval(timerId);
    }
  })
);
const RestaurantInfoBox = enhence(props => {
  const { placeId, remainingTime } = props;
  const { name, vicinity = "Not available" } = props.restaurant;
  const { chosenId, isOpen } = props.popover;
  const { isOpenNow } = props.schedule;
  const {
    formatted_phone_number: phone = DEFAULT_MESSAGE,
    international_phone_number: intPhone = DEFAULT_MESSAGE,
    price_level: price = DEFAULT_MESSAGE,
    website = DEFAULT_MESSAGE
  } = props.details;
  return (
    <RestConsumer>
      {rcProps => {
        return chosenId === placeId && isOpen ? (
          <Popover
            placement="left"
            isOpen={isOpen}
            target={`Popover-${placeId}`}
          >
            <div className="arrow">
              <PopoverHeader>{name}</PopoverHeader>

              <PopoverBody>
                {isOpenNow ? (
                  <div className={wrapperClass}>
                    <i
                      className="material-icons mr-2"
                      style={{ color: "#39e4a9" }}
                    >
                      battery_full
                    </i>
                    <span style={{ borderBottom: "solid #39e4a9 2px" }}>
                      {remainingTime}
                    </span>
                  </div>
                ) : (
                  <div className={wrapperClass}>
                    <i className="material-icons mr-2">battery_charging_full</i>
                    <span style={{ borderBottom: "solid #424242 2px" }}>
                      {remainingTime}
                    </span>
                  </div>
                )}
                <div className={wrapperClass}>
                  <i className="material-icons mr-2">attach_money</i>
                  {price === DEFAULT_MESSAGE ? (
                    <span>{price}</span>
                  ) : (
                    Array(price)
                      .fill()
                      .map((p, i) => (
                        <span
                          role="img"
                          aria-label="money"
                          key={`price-level-${i}`}
                          style={{ fontSize: "3vh" }}
                        >
                          💰
                        </span>
                      ))
                  )}
                </div>
                <div className={wrapperClass}>
                  <i className="material-icons mr-2">phone</i>
                  {phone === DEFAULT_MESSAGE ? (
                    <span>{phone}</span>
                  ) : (
                    <a href={`tel:${intPhone}`}>
                      <span>{phone}</span>
                    </a>
                  )}
                </div>
                <div className={wrapperClass}>
                  <i className="material-icons mr-2">location_on</i>
                  {vicinity === DEFAULT_MESSAGE ? (
                    <span>{vicinity}</span>
                  ) : (
                    <a href={placeSearchURL(placeId)} style={anchorTagStyle}>
                      <span>{vicinity}</span>
                    </a>
                  )}
                </div>
                <div className={wrapperClass}>
                  <i className="material-icons mr-2">web</i>
                  {website === DEFAULT_MESSAGE ? (
                    <span>{website}</span>
                  ) : (
                    <a href={website} style={anchorTagStyle}>
                      <span>{website}</span>
                    </a>
                  )}
                </div>
                <Photos {...props} {...rcProps} />
              </PopoverBody>
            </div>
          </Popover>
        ) : null;
      }}
    </RestConsumer>
  );
});

export default RestaurantInfoBox;
