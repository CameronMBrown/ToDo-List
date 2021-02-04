/* HELPER FUNCTIONS */

//create and overlay a red error window with the passed text
function errorMessage(message) {
  const errMessage = `<div id="err-container" class="error">
    <div id="err-inner">
      <div class="error-text">${message}</div>
    </div>
    <div id="err-btns"></div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend", errMessage);

  //add close button
  const err = document.getElementById("err-container");
  const errInner = document.getElementById("err-inner");
  errInner.appendChild(closeBtn(err));
}

//create a generic close 'x' button
function closeBtn(window, replaceHTML) {
  //pass in the container div that you wish to close
  //(optionally) pass the function that will be drawn in its place
  //returns Node
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

function pageHeader() {
  const header = `
  <div id="titlebox" onclick="window.location.reload()">
    <img src="img/checkmark.png" alt="checkmark logo" width="80px" height="80px">
    <h1>To-Do List<h1>
  </div>
  <div id="landing-container"></div>`;

  document.body.innerHTML = header;
}

//initial webpage state giving a user the option to signup or login
function showWelcome() {
  landing.style.width = "50%";

  const welcome = `<div id="welcome-container">
    <button class="ui-btn">Sign Up</button>
    <button class="ui-btn">Login</button>
  </div>`;
  landing.innerHTML = welcome;

  //event listeners - signup and login buttons
  document
    .getElementById("welcome-container")
    .childNodes[1].addEventListener("click", showSignUp);
  document
    .getElementById("welcome-container")
    .childNodes[3].addEventListener("click", showLogin);
}

//shows the signup dialog for a new user wishing to create an account
function showSignUp() {
  landing.style.width = "50%";

  const signup = `<div id="signupform-container">
    <div class="form-header">Your Name</div>
    <div class="signupform-inner">
      <input type="text" class="login-field" id="fname" placeholder="First Name">
      <input type="text" class="login-field" id="lname" placeholder="Last Name">
    </div>
    <div class="form-header">Login Info</div>
    <div class="signupform-inner">
      <input type="text" class="login-field" id="email" placeholder="Email Address">
      <input type="password" class="login-field" id="pw" placeholder="Password">
    </div>
    <div style="position:relative">
      <button type="submit" class="ui-btn">Sign Up</button>
      <input type="checkbox" class="checkbox" style="position:absolute; top:12%"></checkbox>
      <div class="terms">I have read and agree to the terms and conditions</div>
    </div>
  </div>`;
  landing.innerHTML = signup; //build the form

  signUpNode = document.getElementById("signupform-container");
  signUpNode.childNodes[1].append(closeBtn(signUpNode, showWelcome)); //add a close 'x' button

  //event listeners - save new user
  signUpNode.childNodes[9].childNodes[1].addEventListener("click", () => {
    //create new user obj using localStorage
    if (!document.getElementById("err-container")) {
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
          if (document.querySelector(".checkbox").checked) {
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
    }
  });
}

//shows the login dialog for someone who already has an account
function showLogin() {
  landing.style.width = "50%";
  //removeHTML(document.getElementById("welcome-container")); //clear the welcome buttons

  const signin = `
  <div id="signupform-container">
    <div class="form-header">Enter your Login Credentials</div>
    <div class="signupform-inner">
      <input class="login-field" type="text" placeholder="Email" id="email">
      <input class="login-field" type="password" placeholder="Password" id="pw">
    </div>
    <button id="login" type="submit" class="ui-btn">Login</button>
  </div>`;
  landing.innerHTML = signin; //build the form

  const container = document.getElementById("signupform-container");
  container.childNodes[1].appendChild(closeBtn(container, showWelcome));

  //event listeners - login
  document.getElementById("login").addEventListener("click", () => {
    if (!document.getElementById("err-container")) {
      login();
    }
  });
  document.getElementById("pw").addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !document.getElementById("err-container")) {
      login();
    }
  });

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
  landing.style.width = "70%";

  //stop unwanted logins from console
  if (userObj.pw !== pw) {
    showWelcome();
    errorMessage("Something went wrong, please login through the login page.");
    return;
  }

  const dash = `<div id="dashboard">
    <div class="dashboard-header">
      <h1 class="user-name">${userObj.fname} ${userObj.lname}</h1>
      <button id="logout" class="logout-button">Sign Out</button>
    </div>
    <div id="dashboard-inner">
      <div class="line"></div>
      <div id="icons"></div>
    </div>
    <button id="newlist-btn" class="ui-btn">New List</button>`;
  landing.innerHTML = dash;

  //event listeners
  document.getElementById("logout").addEventListener("click", () => {
    //prevent signout while dialogs are open
    if (
      !document.getElementById("newlist") &&
      !document.getElementById("err-container")
    ) {
      showWelcome();
    }
  });
  document.getElementById("newlist-btn").addEventListener("click", () => {
    //prevent spawning new lists if one is already open
    if (
      !document.getElementById("newlist") &&
      !document.getElementById("err-container")
    ) {
      newList(userObj);
    }
  });

  //call show lists
  showLists(userObj.email);
}

//creates a blank newList interface
function newList() {
  const listUI = `<div id="newlist" class="newlist">
    <div class="newlist-inner">
      <div id="list-title" style="position:relative;">
        <input placeholder="New List..." class="list-title">
      </div>
      <div class="line-dark"></div>
      <div id="bullets" class="bullets-container"></div>
      <div id="list-inner-btns">
        <button id="add" class="ui-btn-dark">+</button>
        <button id="save" class="ui-btn-dark">Save</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend", listUI);

  const list = document.getElementById("newlist");
  const header = document.getElementById("list-title");
  header.appendChild(closeBtn(list));
  //event listeners
  header.childNodes[3].addEventListener("click", () => {
    //dashboard needs to be refereshed upon closing a list
    showLists(userObj.email);
  });
  header.childNodes[1].addEventListener("keydown", (e) => {
    //user can navigate or create list items with tab key
    if (e.key == "Tab") {
      e.preventDefault();
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
  document.getElementById("add").addEventListener("click", () => {
    if (!!document.getElementById("err-container")) {
      newListItem();
    }
  });
  document.getElementById("save").addEventListener("click", () => {
    if (!!document.getElementById("err-container")) {
      save();
    }
  });

  function save() {
    //write changes made to a list to localStorage
    let listTitle = header.childNodes[1].value;
    let thisList = [];

    //create lists attribute in userObj if this is the first ever saved list
    if (numLists <= 0) {
      userObj.lists = [thisList]; //userObj.lists is always a 2D array
    }
    thisList.push(listTitle);

    //record doneness and name of each task
    const bullets = document.getElementById("bullets");
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
  container.classList.add("bullet");
  const bullet = `<input type="checkbox" class="checkbox">
  <input placeholder="New Task..." class="bullet-item">`;
  container.innerHTML = bullet;

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
        nextBullet = container.nextSibling.childNodes[1];
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
  container.append(closeBtn(container));
  document.querySelector(".bullets-container").appendChild(container);
}

//change the contents of an already saved list
function editList(index) {
  newList(); //start by creating a blank new list window on screen
  const listData = userObj.lists[index]; //title and bullets in list to be edited

  //create html elements
  const delBtn = `<button class="ui-btn-dark">Delete</button>`;
  const listBtns = document.getElementById("list-inner-btns");
  listBtns.insertAdjacentHTML("beforeend", delBtn);

  //event listeners - delete list
  listBtns.childNodes[5].addEventListener("click", () => {
    //used to check if the user wants to permanently delete entire list
    errorMessage(
      `Are you sure you want to permanently delete <strong style="font-size: 16px">${listData[0]}</strong>`
    );

    const errBtns = `<button class="ui-btn">Yes</button><button class="ui-btn">No</button>`;
    const btnsContainer = document.getElementById("err-btns");
    btnsContainer.innerHTML = errBtns;

    //event listeners - confirm delete list
    btnsContainer.childNodes[0].addEventListener("click", () => {
      //yes button
      removeHTML(document.getElementById("err-container"));
      removeHTML(document.getElementById("newlist"));
      userObj.lists.splice(index, 1); //remove list but keep rest of array
      numLists--;
      localStorage.setItem(userObj.email, JSON.stringify(userObj)); //save changes
      showLists(userObj.email); //refresh dashboard
    });
    btnsContainer.childNodes[1].addEventListener("click", () => {
      //no button
      removeHTML(document.getElementById("err-container"));
    });
  });

  //fill blank newlist div with contents from userObj for corrisponding list
  document.querySelector(".list-title").value = listData[0]; //title

  //use newListItem to create blank rows to be filled with data
  for (let i = 1; i < listData.length; i++) newListItem();

  //fill list with saved data
  let bullets = document.querySelectorAll(".bullet");
  let i = 1;
  for (let bullet of bullets) {
    console.log(bullet.childNodes);
    if (isDone(listData[i])) {
      //task is saved as done
      bullet.childNodes[2].value = removeDone(listData[i]);
      bullet.childNodes[0].checked = true; //checkbox
    } else {
      bullet.childNodes[2].value = listData[i]; //not done, just copy text data
    }
    i++;
  }
}

//creates smaller icon lists for inside the dashboard
function showLists(user) {
  //update global variables
  userObj = JSON.parse(localStorage.getItem(user));
  numLists = getNumLists(userObj);

  //if being called upon refresh, we need to clear lists shown
  if (document.getElementById("icons").childNodes) {
    document.getElementById("icons").innerHTML = "";
  } else if (document.querySelector(".greeting")) {
    removeHTML(document.querySelector(".greeting"));
  }

  if (1 > numLists) {
    //user not yet created any lists
    const welcomeMessage = `<div class="greeting">Click the 'New List' button to get started!</div>`;
    document
      .getElementById("dashboard-inner")
      .insertAdjacentHTML("beforeend", welcomeMessage);
  } else {
    //1 or more saved lists
    for (let i = 0; i < numLists; i++) {
      //create list icons for dashboard
      const iconHTML = `<div class="icon-container" index="${i}">
        <div class="icon-header">
          <div class="icon-title">${userObj.lists[i][0]}</div>
          <img src="img/edit-icon.png" class="edit-icon">
        </div>
        <ul id="list${i}" class="icon-inner"></ul>
      </div>`;
      document
        .getElementById("icons")
        .insertAdjacentHTML("beforeend", iconHTML);

      let listItems = userObj.lists[i].slice(1); //slice off the first element (the title)

      const thisIcon = document.querySelector(`[index="${i}"]`);
      const thisIconHeader = thisIcon.childNodes[1];

      thisIconHeader.childNodes[3].addEventListener("click", () => {
        //clicking a list icon edits the list
        editList(i);
      });

      //create bullets in icon
      for (let j = 0; j < listItems.length; j++) {
        //fill checkboxes if the task is marked done
        let bulHTML;
        if (isDone(userObj.lists[i][j + 1])) {
          bulHTML = `<li class="icon-list-item">
            <input type="checkbox" position="${j}">
            <div class="icon-text-item">${removeDone(listItems[j])}</div></li>`;
          document
            .getElementById(`list${i}`)
            .insertAdjacentHTML("beforeend", bulHTML);
          thisIcon.querySelector(`[position="${j}"]`).checked = true;
        } else {
          //not done, just copy text data
          bulHTML = `<li class="icon-list-item">
            <input type="checkbox" position="${j}">
            <div class="icon-text-item">${listItems[j]}</div></li>`;
          document
            .getElementById(`list${i}`)
            .insertAdjacentHTML("beforeend", bulHTML);
        }

        //task can be marked done from icon, without opening editList
        const thisCheckbox = thisIcon.querySelector(`[position="${j}"]`);
        thisCheckbox.addEventListener("click", () => {
          if (thisCheckbox.checked) {
            userObj.lists[i][j + 1] = "-DONE-" + userObj.lists[i][j + 1];
          } else {
            userObj.lists[i][j + 1] = removeDone(userObj.lists[i][j + 1]);
          }
          localStorage.setItem(userObj.email, JSON.stringify(userObj)); //save changes to localStorage
        });
      }
    }
  }
}

pageHeader();
const landing = document.getElementById("landing-container");
var userObj;
var numLists;
showWelcome();
//dashboard("cam.brown94@gmail.com", "password");

//TODO disable some buttons when there are other overlayed windows
