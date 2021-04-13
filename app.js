//VERSION 1 (works)

////////////////////////////////////////////////////////////////////////////////////////////////////
////VARIABLES //////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
let internetExplorer = false;
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


////////////////////////////////////////////////////////////////////////////////////////////////////
////FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//CHECK BROWSER ////////////////////////////////////////////////////////////////////////////////////
//need to know as there is Internet Explorer will use Axios instead of fetch() to get the image.
const checkBrowser = () => {
    let ua = window.navigator.userAgent;
    let isIE = /MSIE|Trident/.test(ua);
    if ( isIE ) {
        internetExplorer = true;
    } else {
        internetExplorer = false;
    }
}

//FETCH IMAGE ////////////////////////////////////////////////////////////////////////////////////
//for normal browsers - uses fetch()
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

//for IE - uses Axios
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


//CREATE IMAGE OBJECT////////////////////////////////////////////////////////////////////////////////////
 //create image object that will hold the image's url and picsum id
 const createImageObject = () => {
    let imageObject = {
        url: currentImageURL,
        id: picsumID
    }
    return imageObject;
};

//CREATE A NEW EMAIL GALLERY IN THE DOM//////////////////////////////////////////////////////////////////
const createEmailGallery = () => {
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

//RESET AFTER AN IMAGE IS SAVED //////////////////////////////////////////////////////////////////
 //clears the email input field, hides the email input, displays a new image
const reset = () => {
    emailInput.value = "";
    formFieldset.style.display = "none";
    console.log(emailAddresses); //for testing, appears to be working correctly 

    if(internetExplorer === false) {
        fetchImage();
    } else {
        fetchImageIE();
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////
////PROGRAM STARTS /////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
checkBrowser();

//PAGE LOADED EVENT LISTENER ///////////////////////////////////////////////////////////////////////
//use the fetch function to get an new image
document.addEventListener('DOMContentLoaded', () => {
    if(internetExplorer === false) {
        fetchImage();
    } else {
        fetchImageIE();
    }
    formFieldset.style.display = "none";
})

//SKIP BUTTON EVENT LISTENER ///////////////////////////////////////////////////////////////////////
//use the fetch function to get a new image
skip.addEventListener('click', () => {
    if(internetExplorer === false) {
        fetchImage();
    } else {
        fetchImageIE();
    }
})

//KEEP BUTTON EVENT LISTENER ///////////////////////////////////////////////////////////////////////
//show/hide the form
keep.addEventListener('click', () => {
    if(formFieldset.style.display === "none") {
        formFieldset.style.display = "flex";
        emailInput.focus(); //sets the focus state on the input field so the user can type without selecting the field
    } else {
        formFieldset.style.display = "none";
    }
})


//SAVE BUTTON EVENT LISTENER ///////////////////////////////////////////////////////////////////////
save.addEventListener('click', (event) => {
    
    //IF INPUT IS VALID AND THE DATA CAN BE SUBMITED THEN DO THIS. Otherwise the default HTML validation will do its thing.
    if(emailInput.validity.valid) {
        event.preventDefault();
        event.stopPropagation();
        newEmailAddress = emailInput.value.toLowerCase();

        //CHECK IF THE EMAIL ADDRESS IS ALREADY SAVED 
        //using a for..in loop to check previous email addresses
        for (const property in emailAddresses) {
            //if the email address already exists as a property of the email addresses object
            if(newEmailAddress === property) {
                //create an image object for the selected image
                //push this image object onto the existing email array to that it appears in the gallery for that email address
                const newImage = createImageObject();
                emailAddresses[property].push(newImage);

                //save the property to the savedEmailAddress email so that if the object hasn't been created here 
                //then a new email address array is created below after comparing the current email address with the saved email address
                savedEmailAddress = property;

                //add image to the correct email gallery in the DOM
                let imageContainer = document.createElement("img");  // Create a img element for the image, everytime an image object is created
                let parentContainer = document.querySelector(`.gallery-${CSS.escape(newEmailAddress)}`); //have to use CSS.escape in order to use a variable in document.querySelector 
                parentContainer.appendChild(imageContainer);  // Append image to email address container
                imageContainer.src = currentImageURL; //add the URL as the img src
            }
        }
          
        //IF THE EMAIL ADDRESS ISN'T SAVED 
        //use the condition to check if the email address has been used previously. 
        //If it hasn't then it creates a new email address array with the image data inside
        //If it has then this is ignored
        if(newEmailAddress !== savedEmailAddress) {
            //create an image object for the selected image
            //create a new array for the email address
            //push the image data into the email address array
            const newImage = createImageObject();
            let newEmail = [];
            newEmail.push(newImage);

            //add the email array to the email addresses object as a key/property (name) and value (the array itself)
            //need to use the variable as a key name. example: object[key] = "your_choice";
            emailAddresses[newEmailAddress.toLowerCase()] = newEmail;

            //create the email gallery in the DOM
            createEmailGallery();
        }

        //Resets page after an image is saved. Clears the email input field, hides the email input, displays a new image
        reset();  
    }
})








