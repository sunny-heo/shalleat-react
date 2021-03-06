import React, { Component } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators
} from "reactstrap";
import Spinner from "react-spinkit";
import Restaurant from "../../requests/restaurant"; //class for fetch restaurant
const wrapperClass = "d-flex justify-content-start align-items-center mb-3 ";
class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0, photosFetched: false };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const { activeIndex } = this.state;
    const { photoUrls } = this.props;
    const nextIndex =
      activeIndex === photoUrls.length - 1 ? 0 : activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const { activeIndex } = this.state;
    const { photoUrls } = this.props;
    const nextIndex =
      activeIndex === 0 ? photoUrls.length - 1 : activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }
  async componentDidMount() {
    try {
      this._isMounted = true;
      const { photoUrls: isPhotosAvailable, storePhotoUrls } = this.props;
      const { photos } = this.props.details;

      if (!isPhotosAvailable && photos) {
        const { photoUrls } = await Restaurant.getPhotos(photos, 250);
        await storePhotoUrls(photoUrls);
      }
      if (this._isMounted) {
        await this.setState({ photosFetched: true });
      }
    } catch (error) {
      console.log(error);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { activeIndex, photosFetched } = this.state;
    const { photoUrls } = this.props;
    let items = [];
    const slides = () =>
      photoUrls.map((url, i) => {
        items.push({ src: url });
        return (
          <CarouselItem
            onExiting={this.onExiting}
            onExited={this.onExited}
            key={i}
          >
            <img
              src={url}
              className="rounded"
              alt={url}
              style={{
                height: "25vh",
                width: "100%",
                objectFit: "contain"
              }}
            />
          </CarouselItem>
        );
      });

    return !photosFetched ? (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "25vh",
          width: "100%"
        }}
      >
        <Spinner name="cube-grid" color="#ff4081" />
      </div>
    ) : !photoUrls ? (
      <div className={wrapperClass}>
        <i className="material-icons mr-2">photo</i>
        <span>Not available</span>
      </div>
    ) : (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
      >
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={this.goToIndex}
        />
        {slides()}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={this.previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={this.next}
        />
      </Carousel>
    );
  }
}

export default Photos;
