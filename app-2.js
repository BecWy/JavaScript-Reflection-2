//I decided to create an alternative version of the code, using classes
//I'm struggling to fully understand JS classes/getters/setters etc. so thought it would be good practice
//But I haven't cracked the solution yet.


//VARIABLEs
let url = "https://picsum.photos/300";
let img = document.querySelector("#picsumImg");
let emailInput = document.querySelector("#email");
const skip = document.querySelector("#skip");
const keep = document.querySelector("#keep");
const save = document.querySelector("#save");
const formFieldset = document.querySelector("#form-fieldset");

let newEmailAddress = emailInput.value.toLowerCase(); //the email address that has just been input
let savedEmailAddress = "test@testtesttest.com"; //when the for...in loop checks if an email address already exists it will save an existing email address to here
let emailAddresses = {}; //this object holds all of the email addresses. Each email is its own array, containing an object of image data.
let currentImageURL;
let picsumID; 

const gallery = document.querySelector(".gallery-image-containers");

//Check the browser - is it IE?
//check if the browser is Internet Explorer
let ua = window.navigator.userAgent;
let isIE = /MSIE|Trident/.test(ua);
let internetExplorer = false;

if ( isIE ) {
    internetExplorer = true;
} else {
    internetExplorer = false;
}



class Image {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
    createHTMLImage() {
        //code for creating the html image
        let imageElement = document.createElement("img");  // Create a img element for the image, everytime an image object is created
        imageElement.src = currentImageURL; //add the URL as the img src
        return imageElement; //this might help me to pass this to the email class??????????
    }
    //setter
    set imageParentEmail (email) {
        this._parentEmail = email;
    }
    //getter
    get imageParentEmail () {
        return this._parentEmail;
    }
}


class Email {
     constructor(email, image) {
        this.email = email;
        this.image = image;
     }
    createHTMLEmailGallery() {
        //code for creating the html div
        let emailContainer = document.createElement("div");   // Create a div element for the email address, but only when this is first created
        let heading = document.createElement("h2"); //create a heading for each div
    }
    appendImageNewEmail() {
        //code for appending the image to the email div
        parentContainer.appendChild(imageElement);  // Append image to email address container
    }
    appendImageExistingEmail() {
        //code for appending the image to the email div
        let parentContainer = document.querySelector(`.gallery-${CSS.escape(newEmailAddress)}`); //have to use CSS.escape in order to use a variable in document.querySelector
        parentContainer.appendChild(imageElement);  // Append image to email address container
    }
    appendEmailGallery() {
        //code for appending the email div to the DOM
        emailContainer.appendChild(heading); //Append heading to email address container
        emailContainer.appendChild(imageElement);  // Append image to email address container
        gallery.appendChild(emailContainer);  //append email address container to the gallery
        heading.innerHTML = newEmailAddress; //set heading text to the email address
        emailContainer.classList.add(`gallery-${newEmailAddress}`); //use the email address as a class name, so this can be accessed when checking if an email already exists as a property
    }
    
    //getter
    get newImageElement () {
        const image = new Image (picsumID, currentImageURL); 
    }
 
}









//create new objects using the classes
const image = new Image (picsumID, currentImageURL);
const email = new Email (newEmailAddress, image);

email.image = new Image (picsumID, currentImageURL);  //can create a new image as a property of the email


// EXAMPLE - TO USE THE GETTER
// console.log(objectName.getterName);



//NOTES
//To call a function stored in a class you put the variableName.functionName();








