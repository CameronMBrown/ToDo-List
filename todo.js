const landing = document.getElementById("landing-container");
var userObj;
var numLists;

/* HELPER FUNCTIONS */

//create and overlay a red error window with the passed text
function errorMessage(message) {
  const errorLanding = document.createElement("div");
  const container = document.createElement("div");
  const textDiv = document.createElement("div");

  errorLanding.classList.add("error");
  container.style.position = "relative";
  textDiv.classList.add("error-text");
  textDiv.innerText = message;

  container.append(closeBtn(errorLanding), textDiv);
  errorLanding.append(container);
  document.body.appendChild(errorLanding);
}

//create a generic close 'x' button
function closeBtn(window, replaceHTML) {
  //pass in the container div that you wish to close
  //(optionally) pass the function that will be drawn in its place
  const closeButton = document.createElement("button");

  closeButton.innerText = "x";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", () => {
    removeHTML(window);
    if (replaceHTML !== undefined) {
      replaceHTML();
    }
  });

  return closeButton;
}

//removes root element and all child elements from DOM.
function removeHTML(root) {
  let parent = root.parentNode;
  while (root.lastElementChild) {
    root.removeChild(root.lastElementChild);
  }
  parent.removeChild(root);
}

//get the number of saved todo lists already created by the user
function getNumLists() {
  if (userObj.lists === undefined) {
    return 0;
  } else {
    return userObj.lists.length;
  }
}

//check if the text data contains '-DONE-'
function isDone(bulletText) {
  if ("-DONE-" === bulletText.substring(0, 6)) {
    return true;
  } else {
    return false;
  }
}

//clean up text of a completed task before it is placed in the DOM
//completed tasks have a leading '-DONE-' flag in the data
function removeDone(bulletText) {
  bulletText = bulletText.slice(6); //remove 6 characters = remove '-DONE-'
  return bulletText;
}

/* LOADERS */

//initial webpage state giving a user the option to signup or login
function showWelcome() {
  landing.style.width = "50%";
  const dashboard = document.getElementById("dashboard");
  if (dashboard) {
    removeHTML(dashboard);
  }
  const container = document.createElement("div");
  var signUp = document.createElement("button");

  container.id = "welcome-container";
  signUp.classList.add("ui-btn");
  var login = signUp.cloneNode();
  signUp.innerText = "Sign Up";
  login.innerText = "Login";
  signUp.addEventListener("click", showSignUp);
  login.addEventListener("click", showLogin);

  container.append(signUp, login);
  landing.appendChild(container);
}

//shows the signup dialog for a new user wishing to create an account
function showSignUp() {
  removeHTML(document.getElementById("welcome-container"));
  landing.style.width = "50%";

  //Create required elements
  const container = document.createElement("div");
  container.id = "signupform-container";
  const nameHeader = document.createElement("div");
  const infoHeader = document.createElement("div");
  const inner1 = document.createElement("div");
  const inner2 = document.createElement("div");
  const input = document.createElement("input");
  const terms = document.createElement("div");
  const checkbox = document.createElement("input");
  const signupButton = document.createElement("button");
  const footer = document.createElement("div");

  //grant classes, styles and attributes to elements
  nameHeader.classList.add("form-header");
  nameHeader.innerText = "Your Name";
  infoHeader.classList.add("form-header");
  infoHeader.innerText = "Login Info";
  inner1.classList.add("signupform-inner");
  inner2.classList.add("signupform-inner");
  input.classList.add("login-field");
  input.setAttribute("type", "text");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("checkbox");
  checkbox.style.position = "absolute";
  checkbox.style.top = "12%";
  terms.classList.add("terms");
  terms.innerText = "I have read and agree to the terms and conditions";

  signupButton.setAttribute("type", "submit");
  signupButton.classList.add("ui-btn");
  signupButton.innerText = "Sign Up";
  signupButton.addEventListener("click", () => {
    //create new user obj using localStorage
    let userObj = {};

    const validStr = (str) => {
      //test that string is made up of only letters, no whitespace
      if (!/^[a-zA-Z]+$/.test(str)) {
        errorMessage(
          "Please enter a valid first and last name. Only alphabetic characters are allowed."
        );
      } else {
        return true;
      }
    };

    userObj.fname = document.getElementById("fname").value.trim();
    userObj.lname = document.getElementById("lname").value.trim();
    userObj.email = document.getElementById("email").value.trim();
    userObj.pw = document.getElementById("pw").value;

    //first check for valid text user inputs
    if (validStr(userObj.fname) && validStr(userObj.lname)) {
      //names are only letters
      if (userObj.email != "" && userObj.pw.length >= 8) {
        //email is not blank, password at least 8 char long
        if (container.querySelector(".checkbox").checked) {
          //agree to terms
          if (localStorage.getItem(email)) {
            //check for existing user account
            errorMessage(
              "There is an existing user account with that email. Please use Login page."
            );
          }
          //successfull new user. Store user info & load dashboard
          localStorage.setItem(userObj.email, JSON.stringify(userObj));
          dashboard(userObj.email, userObj.pw);
        } else {
          errorMessage("Please agree to the terms and conditions");
        }
      } else {
        errorMessage(
          "Please enter a valid email. Your password must be at least 8 characters."
        );
      }
    }
  });
  footer.style.position = "relative";

  //clone a generic input feild to inherit classes
  const fname = input.cloneNode(),
    lname = input.cloneNode(),
    email = input.cloneNode(),
    passw = input.cloneNode();
  //customize text input placeholders
  fname.setAttribute("placeholder", "First Name");
  fname.id = "fname";
  lname.setAttribute("placeholder", "Last Name");
  lname.id = "lname";
  email.setAttribute("placeholder", "Email Address");
  email.id = "email";
  passw.setAttribute("placeholder", "Password");
  passw.setAttribute("type", "password");
  passw.id = "pw";

  //build the form
  inner1.append(fname, lname);
  inner2.append(email, passw);
  nameHeader.appendChild(closeBtn(container, showWelcome));
  footer.append(signupButton, checkbox, terms);
  container.append(nameHeader, inner1, infoHeader, inner2, footer);
  landing.appendChild(container);
}

//shows the login dialog for someone who already has an account
function showLogin() {
  landing.style.width = "50%";
  removeHTML(document.getElementById("welcome-container"));

  //create HTML elements
  const container = document.createElement("div");
  const header = document.createElement("div");
  const inner = document.createElement("div");
  const input = document.createElement("input");
  const signinButton = document.createElement("button");

  //add classes and attributes
  container.id = "signupform-container";
  header.classList.add("form-header");
  header.innerText = "Enter your Login Credentials";
  inner.classList.add("signupform-inner");
  input.classList.add("login-field");
  input.setAttribute("type", "text");
  const email = input.cloneNode(),
    passw = input.cloneNode();
  signinButton.setAttribute("type", "submit");
  signinButton.classList.add("ui-btn");
  signinButton.innerText = "Login";
  email.setAttribute("placeholder", "Email");
  email.id = "email";
  passw.setAttribute("placeholder", "Password");
  passw.setAttribute("type", "password");
  passw.id = "pw";

  //event listeners
  signinButton.addEventListener("click", login);
  passw.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      login();
    }
  });

  //build the form
  inner.append(email, passw);
  header.appendChild(closeBtn(container, showWelcome));
  container.append(header, inner, signinButton);
  landing.appendChild(container);

  function login() {
    //attempt to validate login credentials
    const email = document.getElementById("email").value.trim();
    const pw = document.getElementById("pw").value;
    const userObj = JSON.parse(localStorage.getItem(email));

    if (userObj) {
      //ensure the user has already created an account
      if (userObj.pw === pw) {
        dashboard(email, pw); //authenication success, take user to dsahboard
      } else {
        errorMessage("Authentication failure. Wrong username or password.");
      }
    } else if (email == "" || pw.length <= 8) {
      //user left inputs blank or too short
      errorMessage("Please enter a valid email and password.");
    } else {
      //account does not exist, direct user to signup
      errorMessage("Please use the Sign-Up option to create an account first.");
      removeHTML(container);
      showWelcome();
    }
  }
}

//a user-specific homepage showcasing all the user's saved lists
function dashboard(user, pw) {
  userObj = JSON.parse(localStorage.getItem(user));

  //stop unwanted logins from console
  if (userObj.pw !== pw) {
    showWelcome();
    errorMessage("Something went wrong, please login through the login page.");
    return;
  }

  //prepare the dashboard landing div
  let welcome = document.getElementById("welcome-container");
  let signup = document.getElementById("signupform-container");
  let dash = document.getElementById("dashboard");
  if (welcome) {
    removeHTML(welcome);
  } else if (signup) {
    removeHTML(signup);
  } else if (dash) {
    removeHTML(dash);
  }
  landing.style.width = "70%";

  //create HTML elements
  const dashboard = document.createElement("div");
  const header = document.createElement("div");
  const greeting = document.createElement("h1");
  const line = document.createElement("div");
  const logoutBtn = document.createElement("button");
  const listContainer = document.createElement("div");
  const newListBtn = document.createElement("button");

  //add styles and attributes
  dashboard.id = "dashboard";
  header.classList.add("dashboard-header");
  greeting.classList.add("user-name");
  greeting.innerText = userObj.fname + " " + userObj.lname;
  logoutBtn.classList.add("logout-button");
  logoutBtn.innerText = "Sign Out";
  line.classList.add("line");
  listContainer.classList.add("dashboard-inner");
  newListBtn.classList.add("ui-btn");
  newListBtn.innerText = "New List";

  //add event listeners
  logoutBtn.addEventListener("click", () => {
    //prevent signout while dialogs are open
    if (!document.querySelector(".newlist")) {
      showWelcome();
    }
  });
  newListBtn.addEventListener("click", () => {
    newList(userObj);
  });

  //build the dashboard
  header.append(greeting, logoutBtn);
  listContainer.append(line);
  dashboard.append(header, listContainer, newListBtn);
  landing.appendChild(dashboard);
  showLists(userObj.email);
}

//creates a blank newList interface
function newList() {
  //create HTML elements
  const list = document.createElement("div");
  const inner = document.createElement("div");
  const header = document.createElement("div");
  const title = document.createElement("input");
  const closeButton = closeBtn(list);
  const line = document.createElement("div");
  const bullets = document.createElement("div");
  const btnContainer = document.createElement("div");
  const newTodoBtn = document.createElement("button");
  const saveBtn = document.createElement("button");

  //add styles and attributes
  list.classList.add("newlist");
  header.style.position = "relative";
  inner.classList.add("newlist-inner");
  title.setAttribute("Placeholder", "New List...");
  title.classList.add("list-title");
  line.classList.add("line-dark");
  bullets.classList.add("bullets-container");
  btnContainer.classList.add("list-inner-btns");
  newTodoBtn.classList.add("ui-btn-dark");
  newTodoBtn.innerText = "+";
  saveBtn.classList.add("ui-btn-dark");
  saveBtn.innerText = "Save";
  saveBtn.style.display = "inline";

  //add event listeners
  title.addEventListener("keydown", (e) => {
    if (e.key == "Tab") {
      e.preventDefault();
      title.blur();
      let nextBullet = document.querySelector(".bullet-item");
      if (nextBullet) {
        nextBullet.focus();
      } else {
        newListItem();
        let nextBullet = document.querySelector(".bullet-item");
        nextBullet.focus();
      }
    }
  });
  closeButton.addEventListener("click", () => {
    //dashboard needs to be refereshed upon closing a list
    showLists(userObj.email);
  });
  newTodoBtn.addEventListener("click", newListItem);
  saveBtn.addEventListener("click", save);

  //build the new list interface
  header.append(title, closeButton);
  btnContainer.append(newTodoBtn, saveBtn);
  inner.append(header, line, bullets, btnContainer);
  list.appendChild(inner);
  document.body.append(list);

  function save() {
    //write changes made to a list to localStorage
    let listTitle = title.value;
    let thisList = [];

    //create lists attribute in userObj if this is the first ever saved list
    if (numLists <= 0) {
      userObj.lists = [thisList]; //userObj.lists is always a 2D array
    }
    thisList.push(listTitle);

    //record doneness and name of each task
    for (let i = 0; i < bullets.childNodes.length; i++) {
      let bullet = bullets.childNodes[i];
      if (bullet.childNodes[0].checked) {
        //bullet is marked as done
        thisList.push("-DONE-" + bullet.childNodes[1].value);
      } else {
        thisList.push(bullet.childNodes[1].value);
      }
    }

    //check for existing list
    let match = false;
    for (let i = 0; i < numLists; i++) {
      if (thisList[0] === userObj.lists[i][0]) {
        match = true;
        userObj.lists[i] = thisList;
        break;
      }
    }

    if (!match) {
      userObj.lists.push(thisList); //entirely new list
    }

    localStorage.setItem(userObj.email, JSON.stringify(userObj)); //commit changes
    removeHTML(list); //close list window upon save
    showLists(userObj.email); //refresh dashboard
  }
}

//creates an empty row in the newList interface
function newListItem() {
  //create HTML elements
  const container = document.createElement("div");
  const checkbox = document.createElement("input");
  const bulletText = document.createElement("input");

  //add classes and attributes
  container.classList.add("bullet");
  bulletText.setAttribute("Placeholder", "New Task...");
  bulletText.classList.add("bullet-item");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("checkbox");

  //add event listeners
  container.addEventListener("keydown", (e) => {
    const focusPrevBullet = () => {
      let prevBullet = container.previousSibling;
      if (prevBullet) {
        prevBullet.childNodes[1].focus();
      }
    };
    if (e.key == "Tab" || e.key == "ArrowDown") {
      e.preventDefault();
      let nextBullet = container.nextSibling;
      if (nextBullet) {
        nextBullet.childNodes[1].focus();
      } else {
        newListItem();
        let nextBullet = container.nextSibling.childNodes[1];
        nextBullet.focus();
      }
    } else if (e.key == "ArrowUp") {
      focusPrevBullet();
    } else if (e.key == "Escape") {
      focusPrevBullet();
      removeHTML(container);
    }
  });

  //place the bullet in the list
  container.append(checkbox, bulletText, closeBtn(container));
  document.querySelector(".bullets-container").appendChild(container);
}

//change the contents of an already saved list
function editList(index) {
  newList(); //start by creating a blank new list window on screen
  const listData = userObj.lists[index]; //title and bullets in list to be edited
  //create html elements
  const btnsContainer = document.querySelector(".list-inner-btns");
  const delBtn = document.createElement("button");

  delBtn.classList.add("ui-btn-dark");
  delBtn.innerText = "Delete";
  delBtn.addEventListener("click", () => {
    //used to check if the user wants to permanently delete entire list
    errorMessage("Are you sure you want to permanently delete " + listData[0]);
    //create html elements
    const errorContainer = document.querySelector(".error");
    const yesBtn = document.createElement("button");
    const noBtn = document.createElement("button");

    //style buttons
    yesBtn.classList.add("ui-btn");
    yesBtn.innerText = "Yes";
    yesBtn.style.margin = "80px 120px 10px 10px";
    noBtn.classList.add("ui-btn");
    noBtn.innerText = "No";

    yesBtn.addEventListener("click", () => {
      removeHTML(errorContainer);
      removeHTML(document.querySelector(".newlist"));
      userObj.lists.splice(index, 1); //remove list but keep rest of array
      numLists--;
      localStorage.setItem(userObj.email, JSON.stringify(userObj)); //save changes
      showLists(userObj.email); //refresh dashboard
    });
    noBtn.addEventListener("click", () => {
      removeHTML(errorContainer);
    });

    //add extra buttons to dialog window
    errorContainer.append(yesBtn, noBtn);
  });

  //fill blank newlist div with contents from userObj for corrisponding list
  document.querySelector(".list-title").value = listData[0]; //title

  //use newListItem to create blank rows to be filled with data
  for (let i = 1; i < listData.length; i++) newListItem();

  //fill list with saved data
  let bullets = document.querySelectorAll(".bullet");
  let i = 1;
  for (let bullet of bullets) {
    if (isDone(listData[i])) {
      //task is saved as done
      bullet.childNodes[1].value = removeDone(listData[i]);
      bullet.childNodes[0].checked = true; //checkbox
    } else {
      bullet.childNodes[1].value = listData[i]; //not done, just copy text data
    }
    i++;
  }
  btnsContainer.appendChild(delBtn);
}

//creates smaller icon lists for inside the dashboard
function showLists(user) {
  //update global variables
  userObj = JSON.parse(localStorage.getItem(user));
  numLists = getNumLists(userObj);

  //if being called upon refresh, we need to clear lists shown
  if (document.querySelector(".icons")) {
    removeHTML(document.querySelector(".icons"));
  } else if (document.querySelector(".greeting")) {
    removeHTML(document.querySelector(".greeting"));
  }

  if (1 > numLists) {
    //user not yet created any lists
    const welcomeMessage = document.createElement("div");
    welcomeMessage.classList.add("greeting");
    welcomeMessage.innerText = "Click the 'New List' button to get started!";
    document.querySelector(".dashboard-inner").appendChild(welcomeMessage);
  } else {
    //1 or more saved lists
    const icons = document.createElement("div");
    icons.classList.add("icons");

    for (let i = 0; i < numLists; i++) {
      //create list icons for dashboard
      const icon = document.createElement("div");
      const iconHeadder = document.createElement("div");
      const iconTitle = document.createElement("div");
      const editImg = document.createElement("img");
      const iconContents = document.createElement("ul");

      let listItems = userObj.lists[i].slice(1); //slice off the first element (the title)

      //add classes and attributes
      icon.classList.add("icon-container");
      icon.setAttribute("index", i);
      iconHeadder.classList.add("icon-headder");
      iconTitle.classList.add("icon-title");
      editImg.src = "img/edit-icon.png";
      editImg.classList.add("edit-icon");
      iconTitle.innerText = userObj.lists[i][0]; //first index should always be list title
      iconContents.classList.add("icon-inner");

      editImg.addEventListener("click", () => {
        //clicking a list icon edits the list
        editList(i);
      });

      //create bullets in icon
      for (let j = 0; j < listItems.length; j++) {
        const bullet = document.createElement("li");
        const checkbox = document.createElement("input");
        const bulletText = document.createElement("div");

        bullet.classList.add("icon-list-item");
        checkbox.setAttribute("type", "checkbox");
        bulletText.classList.add("icon-text-item");

        //fill checkboxes if the task is marked done
        if (isDone(userObj.lists[i][j + 1])) {
          checkbox.checked = true;
          bulletText.innerText = removeDone(listItems[j]);
        } else {
          bulletText.innerText = listItems[j]; //not done, just copy text data
        }

        //task can be marked done from icon, without opening editList
        checkbox.addEventListener("click", () => {
          if (checkbox.checked) {
            userObj.lists[i][j + 1] = "-DONE-" + userObj.lists[i][j + 1];
          } else {
            userObj.lists[i][j + 1] = removeDone(userObj.lists[i][j + 1]);
          }
          localStorage.setItem(userObj.email, JSON.stringify(userObj)); //save changes to localStorage
        });

        //add bullet
        bullet.append(checkbox, bulletText);
        iconContents.appendChild(bullet);
      }

      //build icon
      iconHeadder.append(iconTitle, editImg);
      icon.append(iconHeadder, iconContents);
      icons.appendChild(icon);
    }

    //add icons to dashboard
    document.querySelector(".dashboard-inner").appendChild(icons);
  }
}

showWelcome();
