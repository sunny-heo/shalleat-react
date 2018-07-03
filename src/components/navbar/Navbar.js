import React, { Fragment } from "react";
import { withState } from "recompose";
import anime from "animejs";
import { Animated } from "react-animated-css";
import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import NavDrawer from "./NavDrawer";
import { MapProvider } from "../context/MapContext";
import SearchBox from "./SearchBox";
import User from "../../requests/user";

const enhance = withState("hovered", "toggleHover", false);
const NavBar = enhance(({ user, updateUser, hovered, toggleHover }) => {
  const signOut = async e => {
    e.preventDefault();
    await User.signOut();
    updateUser(null);
  };

  const style = withUser =>
    withUser
      ? user
        ? { display: "none" }
        : { display: "list-item" }
      : !user
        ? { display: "none" }
        : { display: "list-item" };

  return (
    <div className="NavBar">
      <header className="navbar navbar-dark navbar-full bg-dark doc-navbar-default">
        <span className="navbar-brand mr-auto">
          <NavLink exact to="/" className="navbar-brand mx-0 bg-transparent">
            <Animated animationIn="rotateIn" isVisible={true}>
              <Logo />
            </Animated>
            <Animated animationIn="tada" isVisible={true}>
              <span className="ShallEatTitle ml-2">ShallEat</span>
            </Animated>
          </NavLink>
        </span>
        <Animated
          animationIn="fadeInDown"
          animationOut="bounceOutUp"
          animationInDelay={500}
          isVisible={!!user}
        >
          <SearchBox />
        </Animated>
        <Nav className="ml-auto" navbar>
          <Animated
            animationIn="fadeInLeft"
            animationOut="fadeOutRight"
            animationInDelay={1000}
            isVisible={!!user}
          >
            <NavItem style={style(false)}>
              <NavLink
                exact
                to="/signin"
                className="nav-link d-flex align-items-center bg-transparent border border-white mx-3 px-2"
                onClick={signOut}
              >
                Sign out
              </NavLink>
            </NavItem>
          </Animated>
          <Animated
            animationIn="fadeInLeft"
            animationOut="fadeOutRight"
            isVisible={!user}
          >
            <NavItem
              style={user ? { display: "none" } : { display: "list-item" }}
            >
              <NavLink
                exact
                to="/signin"
                className="nav-link px-2 d-flex align-items-center bg-transparent border border-white "
                onMouseOver={e => {
                  const { currentTarget } = e;
                  toggleHover({ hovered: true });
                }}
                onMouseLeave={e => {
                  toggleHover({ hovered: false });
                }}
              >
                Sign in
              </NavLink>
            </NavItem>
          </Animated>
          <Animated
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            animationInDelay={500}
            isVisible={!user}
          >
            <NavItem
              style={user ? { display: "none" } : { display: "list-item" }}
            >
              <NavLink
                exact
                to="/"
                className="nav-link d-flex align-items-center disabled px-2"
              >
                or
              </NavLink>
            </NavItem>
          </Animated>
          <Animated
            animationIn="fadeInRight"
            animationOut="fadeOutLeft"
            animationInDelay={1000}
            isVisible={!user}
          >
            <NavItem
              style={user ? { display: "none" } : { display: "list-item" }}
            >
              <NavLink
                exact
                to="/signup"
                className="nav-link px-2 d-flex align-items-center bg-transparent border border-white"
              >
                Sign up
              </NavLink>
            </NavItem>
          </Animated>
          <Animated
            animationIn="bounceIn"
            animationOut="bounceOut"
            animationInDelay={1500}
            isVisible={!!user}
          >
            <button
              aria-controls="navdrawerDefault"
              aria-expanded="false"
              aria-label="Toggle Navdrawer"
              className="navbar-toggler border border-white-hint ml-3"
              data-target="#navdrawerDefault"
              data-toggle="navdrawer"
              style={style(false)}
            >
              <span className="navbar-toggler-icon" />
            </button>
          </Animated>
        </Nav>
      </header>
      {user ? <NavDrawer /> : null}
    </div>
  );
});

export default NavBar;
