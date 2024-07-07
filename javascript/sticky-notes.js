const listOfColor= document.querySelector('.list-of-color');
const addColor= document.querySelector('.add-color');
// console.log('addColor' , addColor);
const listOfColorChild = Array.from(listOfColor.children);
let addColorPosition = {
        top: addColor.offsetTop,
        left: addColor.offsetLeft,
      };
// console.log('addColorPositioncccc ' , addColorPosition);
const colorPicker = document.querySelector('.color-picker');
let colorPickerOriginalPosition = {
  top: colorPicker.offsetTop,
  left: colorPicker.offsetLeft,
};
// console.log('colorPickerOriginalPosition', colorPickerOriginalPosition);
const imgNotes = document.querySelector('.img-notes');
let getDate = new Date();
let getDay = getDate.getDate();
let getMonth = getDate.getMonth();
let getYear = getDate.getFullYear();
const months=[
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let arrColors = [];
listOfColorChild.forEach(span => {
  // console.log('addColorPosition ' , addColorPosition);
  let rectOriginal = {
    top: span.offsetTop,
    left: span.offsetLeft,
  };
  arrColors.push(rectOriginal);
  span.style.position = 'absolute';
  span.style.top = (addColorPosition.top + 2 ) + 'px';
  span.style.left = (addColorPosition.left + 2 ) + 'px';
  span.style.zIndex = '-2'
});
addColor.addEventListener('click', ()=>{
    colorPicker.style.cssText = `
    display: block;
    opacity: 0.7;
    transition: all 0.8s ease-in-out; 
    z-index: 1;
    left: ${addColorPosition.left}px;
    top: ${addColorPosition.top}px;
  `;
  setTimeout(() => {
    colorPicker.style.cssText = `
    transition: all 0.8s ease-in-out; 
    z-index: 1;
    left: ${colorPickerOriginalPosition.left}px;
    top: ${colorPickerOriginalPosition.top}px;

  `;
  }, 1500);
  listOfColorChild.forEach((span, index) => {
    const color = arrColors[index];
    span.style.top = color.top + 'px';
    span.style.left = color.left + 'px';
    span.style.zIndex = '1';
    span.style.position = 'static';
  })
  addColor.style.cssText='transform: rotate(360deg);'
})
listOfColorChild.forEach((span) => {
  span.addEventListener('click',(event)=>{
    let rectOriginal = {
      top: span.offsetTop,
      left: span.offsetLeft,
    };
    let style = window.getComputedStyle(event.target);
    let colorBackground = style.backgroundColor;
    addCardNote(colorBackground)
      colorPicker.style.cssText = `
      display: block;
      opacity: 0.7;
      transition: all 0.8s ease-in-out; 
      z-index: 1;
      top: ${rectOriginal.top}px;
      left: ${rectOriginal.left}px;
    `;
    setTimeout(() => {
      colorPicker.style.cssText = `
      transition: all 0.8s ease-in-out; 
      z-index: 1;
      left: ${colorPickerOriginalPosition.left}px;
      top: ${colorPickerOriginalPosition.top}px;
  
    `;
    }, 1500);
    imgNotes.style.display = 'none';
    imgNotes.style.opacity = '0';
    imgNotes.transitions = 'opacity 0.8s ease-in-out';
  })
})
function addCardNote(color) {
  const wrapperNotes = document.querySelector('.notes');
  const createBox = document.createElement('div');
  console.log('from cardadd' , createBox);
  const createParagraph = document.createElement('p');
  const createWrapperDate = document.createElement('div');
  const createDate = document.createElement('span');
  const icons = addIcons(createBox);
  createDate.textContent = `${months[getMonth]} ${getDay} , ${getYear}`
  createBox.className = 'box-note col-lg-4 col-md-6 col-sm-12';
  createDate.className = 'date-note';
  createParagraph.className = 'input-note';
  createWrapperDate.className='wrapper-date-note';
  createWrapperDate.appendChild(createDate);
  createParagraph.setAttribute('contenteditable', "false");
  createParagraph.textContent ='This Is Docket Note...';
  createParagraph.style.backgroundColor = color;
  createBox.appendChild(createParagraph);
  createBox.appendChild(createWrapperDate);
  wrapperNotes.appendChild(createBox)
  const userId = localStorage.getItem("userId");
  const noteData = {
    content: createParagraph.textContent,
    color: color,
    date: `${months[getMonth]} ${getDay} , ${getYear}`,
    userId: userId
  };
    processCardNote(createParagraph, icons, createWrapperDate, createBox, noteData);
    if (createParagraph.getAttribute('contenteditable') === 'false'){
      createWrapperDate.style.display = 'none';
      icons.forEach((icon) => {
        icon.style.display = 'none';
      });
    }
  } 
function addIcons(parentElement) { 
  let iconsArr = [];
  const classesIcons = ['fa-solid fa-trash' , 'fa-solid fa-pen-to-square'];
  classesIcons.forEach(classIcon => {
    const createIcon = document.createElement('i');
    createIcon.className = classIcon
    parentElement.appendChild(createIcon);
    iconsArr.push(createIcon);
  })
  return iconsArr;
}
function processCardNote(cardNote , icons , date ,createBox , noteData ) {
  const message = document.querySelector('.message');
  const continueButton = document.querySelector('.continue');
  const leaveButton = document.querySelector('.leave');
  const placeholderText = 'This Is Docket Note...';
  let savedSelectionText ='';
  let isNewNote = true;
  let hasBeenEdited = false;
  cardNote.addEventListener('click', () =>{
    // if(cardNote.getAttribute('contenteditable') === 'false' && cardNote.textContent !== '') {
    //   isNewNote = false;
    // }
    if (isNewNote && cardNote.getAttribute('contenteditable') === 'false'){
      cardNote.setAttribute('contenteditable', 'true');
      icons.forEach(icon =>{
        icon.style.display = 'none';
      });
      date.style.display = 'none';
      cardNote.focus();
    }
    if(cardNote.textContent === placeholderText){
      cardNote.textContent = '';
    }
  })
  cardNote.addEventListener('input', () => {
    hasBeenEdited = true;
    if(noteData) {
      noteData.content = cardNote.textContent; 
    }
  });
  cardNote.addEventListener('blur', async() =>{
    if(cardNote.textContent.trim() === ""){
      message.style.display = 'flex';
      continueButton.addEventListener('click', () =>{
        message.style.display = 'none';
        cardNote.setAttribute('contenteditable', 'true');
        cardNote.focus();
        icons.forEach(icon =>{
          icon.style.display = 'none';
        });
        date.style.display = 'none';
      })
      leaveButton.addEventListener('click', () =>{
        message.style.display = 'none';
        createBox.remove(); 
      });
    }
    if (cardNote.getAttribute('contenteditable') === 'true'){
      cardNote.setAttribute('contenteditable', 'false');
      const selectionText = window.getSelection();
      if (selectionText.rangeCount > 0) {
        savedSelectionText = selectionText.getRangeAt(0);
        console.log('saved selection' , savedSelectionText);
      }
      icons.forEach(icon =>{
        // console.log('icffff' , icon);
        icon.style.display = 'flex';
      });
      date.style.display = 'block';
      isNewNote = false;
    }
    if (hasBeenEdited && cardNote.textContent.trim() !== '') {
      if(noteData){
        if (createBox.dataset.noteId) {
          await updateNotesForCurrentUser(createBox.dataset.noteId, noteData);
        }else{
          const savedNote = await saveCardNoteToServer(noteData);
          const noteId = savedNote.id;
          createBox.dataset.noteId = noteId;
          console.log('newcard' , noteId);
        }
      }
    }
  });  
  icons.forEach(icon =>{
    if(icon.getAttribute('class') === 'fa-solid fa-pen-to-square'){
      icon.addEventListener('click', async() =>{
        if (cardNote.getAttribute('contenteditable') === 'false'){
          cardNote.setAttribute('contenteditable', 'true');
          icons.forEach(icon =>{
            icon.style.display = 'none';
          });
          date.style.display = 'none';
          cardNote.focus();
          if(savedSelectionText){
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedSelectionText);
          }
            const noteId = createBox.dataset.noteId;
            // console.log('noteupdated out' , noteId);
          if (noteData && noteId) {
            console.log('noteupdated inside' , noteId );
            noteData.content = cardNote.textContent;
            await updateNotesForCurrentUser(noteId, noteData);
        }
      }
    })
    }
    if (icon.getAttribute('class') === 'fa-solid fa-trash') {
      icon.addEventListener('click', () =>{
          const noteId = createBox.dataset.noteId;
          console.log('trash', noteId);
          deleteNotesForCurrentUser(noteId)
      })
    }
  });
}
async function saveCardNoteToServer(data) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/sticky-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    // console.log("Note saved ", responseData);
    return responseData;
  } catch (error) {
    console.error("Failed to save note:", error);
  }
}
async function fetchNotesForCurrentUser() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId")
  try {
    const response = await fetch(`http://localhost:3000/sticky-notes?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const notes = await response.json();
    console.log("Fetched notes:", notes);
    if(notes.length > 0) {
    imgNotes.style.display = 'none';
    imgNotes.style.opacity = '0';
    imgNotes.transitions = 'opacity 0.8s ease-in-out';
    }
    return notes;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  const notes = await fetchNotesForCurrentUser();
  if (notes && notes.length > 0) {
    notes.forEach(note => {
      addExistingNoteToUI(note);
    });
  }
});
function addExistingNoteToUI(note) {
  const wrapperNotes = document.querySelector('.notes');
  const createBox = document.createElement('div');
  // console.log('addingexxxxxx' , createBox);
  const createParagraph = document.createElement('p');
  const createWrapperDate = document.createElement('div');
  const createDate = document.createElement('span');
  const icons = addIcons(createBox);
  createDate.textContent = note.date;
  createBox.className = 'box-note col-lg-4 col-md-6 col-sm-12';
  createDate.className = 'date-note';
  createParagraph.className = 'input-note';
  createWrapperDate.className = 'wrapper-date-note';
  createWrapperDate.appendChild(createDate);
  createParagraph.setAttribute('contenteditable', "false");
  createParagraph.textContent = note.content;
  createParagraph.style.backgroundColor = note.color;
  createBox.appendChild(createParagraph);
  createBox.appendChild(createWrapperDate);
  wrapperNotes.appendChild(createBox);
  createBox.dataset.noteId = note.id;
  const noteData = {
    content: note.content,
    color: note.color,
    date: note.date,
    userId:note.userId
  };
  processCardNote(createParagraph, icons, createWrapperDate , createBox , noteData);
}
function deleteNotesForCurrentUser(noteId) { 
  const token = localStorage.getItem("token");
  const messageDelete = document.querySelector(".message-delete");
  const cancelButton = document.querySelector(".message-delete .cancel");
  const deleteButton = document.querySelector(".message-delete .delete");
  cancelButton.addEventListener("click",()=>{
    messageDelete.style.display = "none";
  })
  deleteButton.addEventListener("click",async()=>{
    try {
      const response = await fetch(`http://localhost:3000/sticky-notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (response.ok) {
        console.log("Note deleted successfully." , response);
        const notes = await fetchNotesForCurrentUser();
        console.log("notessssss", notes);
        console.log('Note deleted successfully' , notes);
        console.log('delete notes for' , notes.length);
        if(notes.length == 0 ) {
          imgNotes.style.display = 'flex';
          imgNotes.style.opacity = '0.3';
          imgNotes.transitions = 'opacity 0.8s ease-in-out';
        }
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
          noteElement.remove();
        }
        console.log('Note deleted successfully.' );
        messageDelete.style.display = "none"
        return true;
      } else {
        console.error("Failed to delete note:", response.status);
        return false; 
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  });
  messageDelete.style.display = "flex";
}
async function updateNotesForCurrentUser(noteId , data){
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:3000/sticky-notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      console.log("Note Update" , response);
      return true; 
    } else {
      console.error("Failed:", response.status);
      return false; 
    }
  } catch (error) {
    console.error("Failed:", error);
  }
}




/* dropdown */
  const select=document.querySelector('.select');
  const menu = document.querySelector('.menu');
select.addEventListener('click', function(){
  menu.classList.toggle('menu-open');
});

/* Logout */
const logout = document.querySelector('.logout');
logout.addEventListener('click', function(){
  console.log('logged out');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location= '../index.html';
});

/* Theme */
const settings = document.querySelector('.settings');
const cardSettings = document.querySelector('.card-settins')
const darkTheme = document.querySelector('#dark-theme');
const lightTheme = document.querySelector('#light-theme');
const stickyNotes = document.querySelector(".sticky-notes");
let theme = "";
settings.addEventListener('click', function(){
  console.log('settings');
  cardSettings.classList.toggle('menu-open')
});
darkTheme.addEventListener("click", function () {
  stickyNotes.classList.add("dark-theme");
  addColor.classList.add("dark-theme");
  menu.classList.add("dark-theme");
  // this.style.cssText = "color : #000000";
  // lightTheme.style.cssText = "color : #777";
  theme = "dark";
  localStorage.setItem("theme", JSON.stringify(theme));
  // console.log("theme: " + theme);
});
/*  Light theme */
lightTheme.addEventListener("click", function () {
  stickyNotes.classList.remove("dark-theme");
  addColor.classList.remove("dark-theme");
  menu.classList.remove("dark-theme");
  theme = "light";
  localStorage.setItem("theme", JSON.stringify(theme));
});

const getTheme = JSON.parse(localStorage.getItem("theme"));
if (getTheme === "dark") {
  stickyNotes.classList.add("dark-theme");
  addColor.classList.add("dark-theme");
  menu.classList.add("dark-theme");
} else if(getTheme === "light"){
  stickyNotes.classList.remove("dark-theme");
  addColor.classList.remove("dark-theme");
  menu.classList.remove("dark-theme");
}
/*  Add UserName */
const userNameElement = document.querySelector(".userName")
document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  console.log('User Name: ' , userName);
  if (userName) {
    const initialsName = userName.slice(0, 2).toUpperCase(); 
    userNameElement.textContent = initialsName;
  }
});
