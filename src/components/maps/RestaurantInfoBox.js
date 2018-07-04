import React from "react";
import { compose, withState, lifecycle } from "recompose";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import Photos from "./Photos";
import moment from "moment";
import "moment-precise-range-plugin";

// const testObj = {
//   name: "54th Ave Cafe",
//   isOpenToday: true,
//   isOpenNow: false,
//   todayHours: {
//     close: {
//       day: 1,
//       time: "2300"
//     },
//     open: {
//       day: 1,
//       time: "1100"
//     }
//   },
//   nextDayHours: {
//     close: {
//       day: 2,
//       time: "2300"
//     },
//     open: {
//       day: 2,
//       time: "1100"
//     }
//   },
//   weekDays: [
//     "Monday: 11:00 AM – 11:00 PM",
//     "Tuesday: 11:00 AM – 11:00 PM",
//     "Wednesday: 11:00 AM – 11:00 PM",
//     "Thursday: 11:00 AM – 11:00 PM",
//     "Friday: 11:00 AM – 11:00 PM",
//     "Saturday: 11:00 AM – 11:00 PM",
//     "Sunday: 11:00 AM – 11:00 PM"
//   ]
// };

const anchorTagStyle = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap"
};
const wrapperClass = "d-flex justify-content-start align-items-center mb-3 ";
const currentTime = moment().format("HHmm");
const timeFormatter = time => time.slice(0, 2) + ":" + time.slice(2);
const timeHelper = ({
  notAvailable,
  immortal,
  isOpenToday,
  isOpenNow,
  todayHours
}) => {
  if (notAvailable) return notAvailable;
  if (immortal) return "Open 24 hours";
  const { open, close } = todayHours;
  let closeTime, openTime;
  console.log("currentTime => ", currentTime);
  console.log("isOpenToday in timeHelpr => ", isOpenToday);
  console.log("isOpenNow in timeHelpr => ", isOpenNow);
  console.log("todayHours in timeHelpr => ", todayHours);
  if (isOpenToday) {
    if (isOpenNow) {
      const closeHours = timeFormatter(close.time);
      const diff = Math.abs(close.day - open.day);
      if (diff) {
        closeTime = moment(moment().format(`YYYY-MM-DD ${closeHours}:00`)).add(
          diff,
          "d"
        );
      } else {
        closeTime = moment().format(`YYYY-MM-DD ${closeHours}:00`);
      }
    } else {
      if (open.time >= currentTime) {
        const openhours = timeFormatter(open.time);
        openTime = moment().format(`YYYY-MM-DD ${openhours}:00`);
        console.log("openTime in timeHelpr => ", openTime);
      } else {
        const closedHours = timeFormatter(open.time);
        closeTime = moment().format(`YYYY-MM-DD ${closedHours}:00`);
      }
    }
  }
  return { openTime, closeTime };
};

const currentYearDateTime = () => moment().format("YYYY-MM-DD HH:mm:ss");

const calcRemainTime = ({ openTime = false, closeTime }) => {
  console.log("openTim => ", openTime);
  console.log("closeTime => ", closeTime);

  return openTime
    ? moment(currentYearDateTime()).preciseDiff(openTime)
    : moment(currentYearDateTime()).preciseDiff(closeTime);
};

let timerID;
const enhence = compose(
  withState("remainingTime", "setRemainingTime", ""),
  lifecycle({
    componentDidMount() {
      const { schedule, setRemainingTime } = this.props;
      const businessHours = timeHelper(schedule);
      if (typeof businessHours === "string")
        return setRemainingTime(businessHours);
      else {
        console.log("schedule => ", schedule);
        calcRemainTime(timeHelper(schedule));
        const time = timeHelper(schedule);
        setRemainingTime(calcRemainTime(time));
        timerID = setInterval(
          () => setRemainingTime(calcRemainTime(time)),
          1000
        );
      }
    },
    componentWillUnmount() {
      clearInterval(timerID);
    }
  })
);
const RestaurantInfoBox = enhence(
  ({
    placeId,
    lat,
    lng,
    name,
    schedule,
    remainingTime,
    popover,
    photoUrls,
    detail,
    vicinity = "Not available"
  }) => {
    const { chosenId, isOpen } = popover;
    const { isOpenNow } = schedule;
    const {
      formatted_phone_number: phone = "Not available",
      international_phone_number: intPhone = "Not available ",
      price_level: price = "Not available",
      website = "Not available"
    } = detail;
    console.log(schedule);
    if (chosenId === placeId && isOpen) {
      return (
        <div className="RestaurantInfoBox border border-info ">
          {
            <Popover
              placement="auto"
              isOpen={isOpen}
              target={`Popover-${placeId}`}
            >
              <div className="arrow">
                <PopoverHeader>{name}</PopoverHeader>

                <PopoverBody>
                  <div className={wrapperClass}>
                    <i className="material-icons mr-2">attach_money</i>
                    {price === "Not available" ? (
                      <span>{price}</span>
                    ) : (
                      Array(price)
                        .fill()
                        .map((p, i) => (
                          <span
                            role="image"
                            alt="money"
                            key={`price-level-${i}`}
                            style={{ fontSize: "3vh" }}
                          >
                            💰
                          </span>
                        ))
                    )}
                  </div>

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
                      <i class="material-icons mr-2">battery_charging_full</i>
                      <span>{remainingTime}</span>
                    </div>
                  )}
                  <div className={wrapperClass}>
                    <i className="material-icons mr-2">phone</i>
                    {phone === "Not available" ? (
                      <span>{phone}</span>
                    ) : (
                      <a href={intPhone}>
                        <span>{phone}</span>
                      </a>
                    )}
                  </div>
                  <div className={wrapperClass}>
                    <i className="material-icons mr-2">location_on</i>
                    {vicinity === "Not available" ? (
                      <span>{vicinity}</span>
                    ) : (
                      <a
                        href={`https://maps.google.com/maps/place/${lat},${lng}`}
                        style={anchorTagStyle}
                      >
                        <span>{vicinity}</span>
                      </a>
                    )}
                  </div>
                  <div className={wrapperClass}>
                    <i className="material-icons mr-2">web</i>
                    {website === "Not available" ? (
                      <span>{website}</span>
                    ) : (
                      <a href={website} style={anchorTagStyle}>
                        <span>{website}</span>
                      </a>
                    )}
                  </div>
                  <Photos photoUrls={photoUrls} placeId={placeId} />
                </PopoverBody>
              </div>
            </Popover>
          }
        </div>
      );
    } else {
      return <div className="RestaurantInfoBox" />;
    }
  }
);

export default RestaurantInfoBox;
