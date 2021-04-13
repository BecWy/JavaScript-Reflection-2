//VERSION 2 (experimental, doesn't work)

//I decided to try to create an alternative version of the code, using classes
//I'm struggling to fully understand JS classes/getters/setters etc. so thought it would be good practice


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


////CLASSES
//think i need to leave the email addresses as arrays?
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




//FETCH IMAGE ////////////////////////////////////////////////////////////////////////////////////

//Function for normal browsers
const fetchImage = () => {
    fetch(url)
    ///get the data we need (aka the specific image's url) from the response
    .then(response => { 
        response.blob(); 
        console.log(response);
        picsumID = response.headers.get('picsum-id');
        console.log(picsumID);
        return response.url;
    })
    //set the image source to the url that comes back from the API. Also need to reuse this later to attach it to an email
    .then(data => {
        img.src = data;
        currentImageURL = data;
    })
    //catch is what needs to happen if there is an error
    .catch(err => {
        alert("Please refresh the page");
    });
}

//Function for IE
const fetchImageIE = () => {
    // axios.get(url) //note that Axios data is automatically parsed to a JS object
    // ///get the data we need (aka the specific image's url) from the response
    const axiosImage = () => axios.get("https://picsum.photos/300")
    .then((response) => {
        picsumID = response.headers['picsum-id'];
        currentImageURL = `https://picsum.photos/id/${picsumID}/300/300`;
        img.src = currentImageURL;
    })
    //catch is what needs to happen if there is an error
    .catch(err => {
        alert("Please refresh the page");
    });

    axiosImage();
};



//EVENT LISTENERS ////////////////////////////////////////////////////////////////////////////////

//Page loaded event listener
document.addEventListener('DOMContentLoaded', () => {
    if(internetExplorer === false) {
        fetchImage();
    } else {
        fetchImageIE();
    }
    formFieldset.style.display = "none";
})

///Button event listeners

//SKIP button
//use the fetch function above to get a new image
skip.addEventListener('click', () => {
    if(internetExplorer === false) {
        fetchImage();
    } else {
        fetchImageIE();
    }
})

//KEEP button
//show/ hide the form
keep.addEventListener('click', () => {
    if(formFieldset.style.display === "none") {
        formFieldset.style.display = "flex";
        emailInput.focus(); //sets the focus state on the input field so the user can type without selecting the field
    } else {
        formFieldset.style.display = "none";
    }
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///NEW CODE STARTS HERE 
//code relating to the save button


//SAVE button
save.addEventListener('click', (event) => {
    
    //IF INPUT IS VALID AND THE DATA CAN BE SUBMITED THEN DO THIS. Otherwise the default HTML validation will do its thing.
    if(emailInput.validity.valid) {
        event.preventDefault();
        event.stopPropagation();
        newEmailAddress = emailInput.value.toLowerCase();

        //using a for..in loop to check previous email addresses
        for (const property in emailAddresses) {
            //if the email address already exists as a property of the email addresses object
            if(newEmailAddress === property) {
                //console.log(`The email address already exists: ${property}`); //for testing



                //////////////////////////////////////
                //NEED NEW CODE HERE
                 //create image data object
                let imageDataObject = {
                    url: currentImageURL
                };

                //push this image data object onto the existing array
                emailAddresses[property].push(imageDataObject);

                //save the property to the savedEmailAddress email so that if the object hasn't been created here 
                //then a new email address array is created below after comparing the current email address with the saved email address
                savedEmailAddress = property;

                //add image to gallery in the DOM
                let imageContainer = document.createElement("img");  // Create a img element for the image, everytime an image object is created
                let parentContainer = document.querySelector(`.gallery-${CSS.escape(newEmailAddress)}`); //have to use CSS.escape in order to use a variable in document.querySelector 
                parentContainer.appendChild(imageContainer);  // Append image to email address container
                imageContainer.src = currentImageURL; //add the URL as the img src
            }
        }
          
        //checks if the email address has been used previously. If it hasn't then it creates a new email address array with the image data inside
        if(newEmailAddress !== savedEmailAddress) {
            
            //create image data object
            let imageDataObject = {
                url: currentImageURL
            };

            //create a new array for the email address and push the image data in
            let emailArray = [];
            emailArray.push(imageDataObject);

            //add the email array to the email addresses object as a key (name) and property (the array itself)
            //need to use the variable as a key name
            //example: object[key] = "your_choice";
            emailAddresses[newEmailAddress.toLowerCase()] = emailArray;
            //console.log(`the email address is new - ${emailInput.value}`); //for testing, checking which condition was used
        
            //create the gallery in the DOM
            //create elements
            let emailContainer = document.createElement("div");   // Create a div element for the email address, but only when this is first created
            let heading = document.createElement("h2"); //create a heading for each div
            let imageContainer = document.createElement("img");  // Create a img element for the image, everytime an image object is created
            
            //append elements
            emailContainer.appendChild(heading); //Append heading to email address container
            emailContainer.appendChild(imageContainer);  // Append image to email address container
            gallery.appendChild(emailContainer);  //append email address container to the gallery
            
            //display image & heading text
            imageContainer.src = currentImageURL; //add the URL as the img src
            heading.innerHTML = newEmailAddress;

            //add class to email div
            emailContainer.classList.add(`gallery-${newEmailAddress}`); //use the email address as a class name, so this can be accessed when checking if an email already exists as a property
        
        }

      
        ////////////////////////////////////////////////////////
        //Don't need to mess with this part
        //
        //RESET
        //clears the email input field, hides the email input, display a new image
        emailInput.value = "";
        formFieldset.style.display = "none";
        console.log(emailAddresses); //for testing, appears to be working correctly 

        if(internetExplorer === false) {
            fetchImage();
        } else {
            fetchImageIE();
        }
    }
})




