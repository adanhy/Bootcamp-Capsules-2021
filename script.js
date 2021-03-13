const bootcampURL = `https://apple-seeds.herokuapp.com/api/users/`;

var students = [];
var displayed_info = [];

function AddLine(lineObj) {
  //   console.log(lineObj);
  const thead = document.querySelector(`#table-data`);
  const row = document.createElement(`tr`);

  for (const prop in lineObj) {
    const th = document.createElement(`th`);
    th.textContent = lineObj[prop];

    if (prop == `city`) {
      th.classList.add(`weatherHover`);
      const spn = document.createElement(`span`);
      spn.classList.add(`tooltip`);
      th.appendChild(spn);
    }
    row.appendChild(th);
  }

  const editbtn = document.createElement(`button`);
  editbtn.classList.add(`editbtn`);
  editbtn.textContent = `Edit`;
  const deletebtn = document.createElement(`button`);
  deletebtn.classList.add(`deletebtn`);
  deletebtn.textContent = `Delete`;
  row.appendChild(editbtn);
  row.appendChild(deletebtn);
  row.setAttribute(`dataid`, lineObj.id);
  thead.appendChild(row);
}

function AddHeadLine(lineObj, arr) {
  //   if (!lineObj) return;
  try {
    const thead = document.querySelector(`#thead`);
    thead.innerHTML = ``;
    const row = document.createElement(`tr`);
    const headers = lineObj;
    Object.keys(headers).forEach(async (v) => {
      const th = document.createElement(`th`);
      th.textContent = v;
      th.addEventListener(`click`, (e) => {
        refresh(sortDataByKey(th.textContent, arr));
      });
      row.appendChild(th);
    });
    thead.appendChild(row);
  } catch (error) {
    console.log(error);
  }
}

function addSelections(lineObj) {
  if (!lineObj) return;
  const selection = document.querySelector(`#fields`);
  selection.innerHTML = ``;
  Object.keys(lineObj).forEach(async (v) => {
    const option = document.createElement(`option`);
    option.textContent = v;
    option.value = v;
    selection.appendChild(option);
  });
}

async function SetSearch() {
  const srchbtn = document.querySelector(`#srchbtn`);
  srchbtn.addEventListener(`click`, () => {
    const fld = document.querySelector(`#fields`).value;
    const val = document.querySelector(`#srchval`).value;
    refresh(searchFieldByValue(fld, val));
  });

  const resetbtn = document.querySelector(`#resetbtn`);
  resetbtn.addEventListener(`click`, () => {
    refresh(students);
  });

  const txt = document.querySelector(`#srchval`);
  txt.addEventListener(`keyup`, (event) => {
    const fld = document.querySelector(`#fields`).value;
    const val = document.querySelector(`#srchval`).value;
    refresh(searchFieldByValue(fld, val));
  });

  //   const refetch = document.querySelector(``);
}

function refresh(arr) {
  const spinner = document.querySelector(`.lds-ripple`);
  spinner.style.display = `flex`;

  if (!arr) return;
  document.querySelector(`#table-data`).innerHTML = ``;
  AddHeadLine(arr[0], arr);
  SetSearch();
  arr.forEach(async (a) => {
    AddLine(a);
  });
  setDeleteButtons(arr);
  setEditButtons();
  setWeatherHover();
  spinner.style.display = `none`;
}

async function fetchData() {
  //   const checkIfExists = localStorage.getItem("students");

  //   window.addEventListener("unload", () => {
  //     localStorage.setItem("students", JSON.stringify(students));
  //   });

  //   if (checkIfExists) {
  //     console.log(`welcome back`);
  //     students = await JSON.parse(checkIfExists);
  //     refresh(students);
  //     return false;
  //   }

  console.log(`first time here?`);
  try {
    const AllResp = await fetch(bootcampURL);
    const AllProm = await AllResp.json();

    for (const i in AllProm) {
      const idd = AllProm[i].id;
      const infoResp = await fetch(bootcampURL + idd);
      const info = await infoResp.json();
      AllProm[i].age = info.age;
      AllProm[i].city = info.city;
      AllProm[i].gender = info.gender;
      AllProm[i].hobby = info.hobby;

      students.push({
        id: AllProm[i].id,
        firstName: AllProm[i].firstName,
        lastName: AllProm[i].lastName,
        capsule: AllProm[i].capsule,
        age: info.age,
        city: info.city,
        gender: info.gender,
        hobby: info.hobby,
      });
    }
    addSelections(students[0]);

    refresh(students);
  } catch (error) {
    console.log(error);
  }
}

function searchFieldByValue(field, val) {
  return students.reduce((acc, e) => {
    if (e[field] == val) {
      return [...acc, e];
    }
    return acc;
  }, []);
}

function sortDataByKey(key, arr) {
  return arr.sort((a, b) => {
    if (a[key] > b[key]) return 1;
    if (a[key] < b[key]) return -1;
    else return 0;
  });
}

function setDeleteButtons(arr) {
  const delbuttons = document.querySelectorAll(`.deletebtn`);
  delbuttons.forEach((btn) => {
    btn.addEventListener(`click`, (e) => {
      const clicked_id = e.target.closest(`tr`).getAttribute(`dataid`);
      DeleteStudentById(clicked_id);
      arr.forEach((obj, i) => {
        if (obj.id == clicked_id) {
          arr.splice(i, 1);
        }
      });
      refresh(arr);
    });
  });
}

function UpdateStudentById(row) {
  console.log(row[6]);
  for (let i = 0; i < students.length; i++) {
    if (students[i].id == row[0].textContent) {
      students[i].firstName = row[1].querySelector(`input`).value;
      students[i].lastName = row[2].querySelector(`input`).value;
      students[i].capsule = row[3].querySelector(`input`).value;
      students[i].age = row[4].querySelector(`input`).value;
      students[i].city = row[5].querySelector(`input`).value;
      students[i].gender = row[6].querySelector(`select`).value;
      students[i].hobby = row[7].querySelector(`input`).value;
    }
  }
  refresh(students);
}

function DeleteStudentById(student_id) {
  console.log(student_id);
  for (let i = 0; i < students.length; i++) {
    if (students[i].id == student_id) {
      students.splice(i, 1);

      return true;
    }
  }
  refresh(students);
  return false;
}

function FromTextToInput(element, indx) {
  const txt = element.textContent;

  //textboxes

  if (indx == 3 || indx == 4) {
    const num = document.createElement(`input`);
    num.setAttribute(`type`, `number`);
    num.setAttribute(`min`, `0`);
    num.setAttribute(`max`, `120`);
    num.value = txt;
    element.textContent = "";
    element.appendChild(num);
  } else if (indx == 6) {
    // gender
    const select = document.createElement(`select`);
    const male = document.createElement(`option`);
    male.value = `Male`;
    male.textContent = "Male";
    const female = document.createElement(`option`);
    female.value = `Female`;
    female.textContent = "Female";

    element.textContent = "";
    select.appendChild(female);
    select.appendChild(male);
    element.appendChild(select);

    if (txt == `Male`) {
      male.selected = `true`;
    } else {
      female.selected = `true`;
    }
  } else {
    const txtbox = document.createElement(`input`);
    txtbox.setAttribute(`type`, `text`);
    txtbox.value = txt;
    element.textContent = "";
    element.appendChild(txtbox);
  }
}

function setEditButtons() {
  const editbuttons = document.querySelectorAll(`.editbtn`);

  editbuttons.forEach((btn) => {
    btn.addEventListener(`click`, (e) => {
      const clicked_row = e.target.closest(`tr`);
      const clicked_row_children = e.target.closest(`tr`).children;
      const clicked_id = clicked_row.getAttribute(`dataid`);

      const arr = Array.from(clicked_row_children);

      console.log(arr);

      for (let i = 1; i < arr.length - 2; i++) {
        FromTextToInput(arr[i], i);
        console.log(arr[i]);
      }

      const confirm_btn = document.createElement(`button`);
      confirm_btn.textContent = `Confirm`;
      confirm_btn.style.backgroundColor = `lime`;

      confirm_btn.addEventListener(`click`, () => {
        UpdateStudentById(arr);
        console.log(arr);
      });
      arr[8].replaceWith(confirm_btn);
    });
  });
}

function setWeatherHover() {
  try {
    const items = document.querySelectorAll(`.weatherHover`);

    items.forEach((v) => {
      v.addEventListener(`mouseover`, async (e) => {
        const cityResp = await fetch(
          `https://api.codetabs.com/v1/proxy?quest=api.openweathermap.org/data/2.5/weather?q=${e.target.textContent}&appid=1098b0af8c3d64f1a9559d9696537cd4`
        );
        const cityTemp = await cityResp.json();
        e.target.querySelector(`span`).textContent =
          `temp: ` + Math.floor(cityTemp.main.temp - 273.15) + `c`;
      });
    });
  } catch (error) {
    console.log(error);
  }
}

fetchData();
