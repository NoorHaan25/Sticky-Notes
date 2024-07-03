const signUp = document.getElementById("text-signUp");
const login = document.querySelector(".login-wrapper");
const togglePassword = document.querySelectorAll(".toggle-password");
const passwordSignUp = document.getElementById("password-register");
const userNameSignUp = document.getElementById("user-name");
const emailSignUp = document.getElementById("email-register");
const registerForm = document.getElementById("register-form");
const signUpButton = document.getElementById("sign-up");
const emailLogin = document.getElementById("email-login");
const passwordLogin = document.getElementById("password-login");
const loginForm = document.getElementById("login-form");
const checkPassword= document.querySelector(".check-password");
const checkPasswordLogin = document.querySelector(".check-password-login");
const checkEmail = document.querySelector(".check-email");
let isUserNameValid = false;
let isEmailValid = false;
login.addEventListener("click", () => {
  login.style = "bottom: 0px";
});
signUp.addEventListener("click", () => {
  login.style = "bottom: -75%";
});
togglePassword.forEach((button) => {
  button.addEventListener("click", () => {
    console.log("button clicked", button);
    if (button.id === "toggleSignUp") {
      if (button.textContent === "Show") {
        passwordSignUp.setAttribute("type", "text");
        button.textContent = "Hide";
      } else if (button.textContent === "Hide") {
        passwordSignUp.setAttribute("type", "password");
        button.textContent = "Show";
      }
    }else if (button.id === "toggleLogin") {
      if (button.textContent === "Show") {
        passwordLogin.setAttribute("type", "text");
        button.textContent = "Hide";
      } else if (button.textContent === "Hide") {
        passwordLogin.setAttribute("type", "password");
        button.textContent = "Show";
      }
    }
  });
});
if (passwordSignUp.length < 6) {
  alert("Password must be at least 6 characters long.");
}
/* Sign Up */
registerForm.onsubmit = async function (e) {
  e.preventDefault();
  const data = {
    email: emailSignUp.value,
    password: passwordSignUp.value,
    userName: userNameSignUp.value,
  };
  if (data.password.length < 8) {
    passwordSignUp.style.cssText="border: 2px solid #cb2027";
    checkPassword.style.display="block";
    return; 
  }
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("success", responseData);
    localStorage.setItem("token", responseData.accessToken);
    window.location = "../sticky-notes.html";
  } catch (error) {
    console.error("error", error);
  }
};

/* Login */
loginForm.onsubmit = async function (e) {
  e.preventDefault();
  const data = {
    email: emailLogin.value,
    password: passwordLogin.value,
  };
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if(response.ok){
      
      console.log('responseData', responseData);
      console.log("success", responseData.user.id);
      localStorage.setItem("token", responseData.accessToken);
      localStorage.setItem("userId", responseData.user.id);
      window.location = "../sticky-notes.html";
    }else if(response.status === 400){
      if(responseData === "Cannot find user"){
        checkEmail.style.display = "block";
        emailLogin.style.cssText="border: 2px solid #cb2027";
        // console.log('The email you entered is not registered. Please sign up.');
      }else if(responseData === "Incorrect password" || responseData === "Password is too short")
        {
          checkPasswordLogin.style.display = "block";
          passwordLogin.style.cssText="border: 2px solid #cb2027";
          // console.log("The password you entered is incorrect. Please try again");
        }
      else{
        console.log('error' , responseData);
      }
    }
  } catch (error) {
    console.error("error", error);
  }
};

