import React from "react";
import "./style.scss";
import loginImg from "../../login.svg";
import Cookie from "js-cookie";
import Home from "../Home"
export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  async handleLogin(ev) {
    var email = this.state.email;
    var password = this.state.password;
    ev.preventDefault();
    // const data = { email: email, password: password };
    await fetch("https://tranquil-sands-93018.herokuapp.com/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => {
      response.json().then((body) => {
        if (body.error) {
          document.getElementById("error").className = document
            .getElementById("error")
            .className.replace(/(?:^|\s)d-none(?!\S)/g, "d-block");
        } else {
          if (body.token === null) {
            document.getElementById(
              "error"
            ).className = document
              .getElementById("error")
              .className.replace(/(?:^|\s)d-none(?!\S)/g, "d-block");
          } else {
            localStorage.setItem("token", body.token);
            localStorage.setItem("user", JSON.stringify(body.userinfo));
            Cookie.set("token", body.token);
            sessionStorage.setItem("token", body.token);
            this.props.callbackFromParents(body.userinfo.type);
            this.props.callbackFromParentsfortoken(body.token);
            if (body.userinfo.type === false) {
              this.props.history.push("/user");
            } else {
              this.props.history.push("/host");
            }
          }
        }
      });
    });
  }
  render() {
    if(Cookie.get("token") && JSON.parse(localStorage.getItem("user")).type === false){
      this.props.history.push("/user")
      return <Home/>
    }
    else if(Cookie.get("token") && JSON.parse(localStorage.getItem("user")).type === true){
      this.props.history.push("/host")
      return <Home/>
    }
    else {
      return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="" />
          </div>
          <div className="d-none ml-4 text-danger" id="error">
            <h5 style={{ color: "red" }}>Incorrect email or password</h5>
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={this.handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
    }
  }
}
