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
const deleteButton = document.querySelector(".delete-button");
const formFieldset = document.querySelector("#form-fieldset");
const divElements = document.querySelector("div");

let newEmailAddress = emailInput.value.toLowerCase(); //the email address that has just been input
let savedEmailAddress; //when the for...in loop checks if an email address already exists it will save an existing email address to here
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
        picsumID = response.headers.get('picsum-id');
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


//CREATE AN IMAGE ELEMENT INSIDE AN <A> ELEMENT /////////////////////////////////////////////////////////
const createImageElement = () => {
    let imageElement = document.createElement("img");  // Create a img element for the image, everytime an image object is created
    let imageAnchor = document.createElement("a"); //create an <a> which will be the parent of the img element
    let icon = document.createElement("i");

    //create and append a delete button to each image
    let newDeleteButton = document.createElement("div");
    newDeleteButton.classList.add('delete-button');
    imageAnchor.appendChild(newDeleteButton);
    imageAnchor.style.position = "relative";
    icon.classList.add("delete-icon");
    icon.classList.add("far");
    icon.classList.add("fa-times-circle");
    newDeleteButton.appendChild(icon);

    //display image and set the alt to the photo's ID number
    imageElement.src = currentImageURL; //add the URL as the img src
    imageElement.alt = picsumID;

    //set the <a> link, open this link in a new tab, 
    imageAnchor.href = currentImageURL; //temporarily disabled for testing delete button
    imageAnchor.target = "_blank";

    //add the picsum ID as a class to the image Anchor
    imageAnchor.classList.add(`picsumID-${picsumID}`);

    //append image
    imageAnchor.appendChild(imageElement); //Append image to <a> tag

    //return the image anchor as this is the parent element. This can then be used to append the new image to an email gallery.
    return imageAnchor;
}

//CREATE A NEW EMAIL GALLERY IN THE DOM//////////////////////////////////////////////////////////////////
const createEmailGallery = () => {
    //create elements
    const newImage = createImageElement();
    let emailGallery = document.createElement("div");   // Create a div element for the email address, but only when this is first created
    let heading = document.createElement("h2"); //create a heading for each div
    
    //append elements
    emailGallery.appendChild(heading); //Append heading to email address container
    emailGallery.appendChild(newImage); //Append the image to the email address container
    gallery.appendChild(emailGallery);  //append email address container to the gallery
    
    //set heading text
    heading.innerHTML = newEmailAddress;
    
    //add a class to the email div so that new images can be added to the correct email div at a later point
    emailGallery.classList.add(`gallery-${newEmailAddress}`); //use the email address as a class name, so this can be accessed when checking if an email already exists as a property
}

//RESET AFTER AN IMAGE IS SAVED //////////////////////////////////////////////////////////////////
 //clears the email input field, hides the email input, displays a new image
const reset = () => {
    emailInput.value = "";
    formFieldset.style.display = "none";
    console.log("The updated emailAddress array is as follows:"); //for testing, improve readability in console
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
                const newImageObject = createImageObject();
                emailAddresses[property].push(newImageObject);

                //save the property to the savedEmailAddress email so that if the object hasn't been created here 
                //then a new email address array is created below after comparing the current email address with the saved email address
                savedEmailAddress = property;

                //Create a new image and append this to the existing email gallery
                const newImageElement = createImageElement();
                let emailGallery = document.querySelector(`.gallery-${CSS.escape(newEmailAddress)}`); //have to use CSS.escape in order to use a variable in document.querySelector 
                emailGallery.appendChild(newImageElement);  // Append image to email address container
            }
        }
          
        //IF THE EMAIL ADDRESS ISN'T SAVED 
        //use the condition to check if the email address has been used previously. 
        //If it hasn't then it creates a new email address array with the image data inside
        if(newEmailAddress !== savedEmailAddress) {
            //1) create an image object for the selected image 2) create a new array for the email address
            //3) push the image data into the email address array
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

//DELETE BUTTON EVENT LISTENER ///////////////////////////////////////////////////////////////////////
//NOTE can't add an event listener to an element that doesn't exist yet.
//so have to add it to the body/another selector, and then check for a class name.
//also, if it's the last image attached to the email then I need to delete the whole email gallery - needs to check array length.
//need to check parent id or url
divElements.addEventListener('click', (event)=> {
    ///numberOfChildren includes the number of images in the email gallery AS WELL AS THE HEADER
    let numberOfChildren = event.target.parentElement.parentElement.childElementCount;
    //console.log(numberOfChildren);

    //if last image
    if(numberOfChildren === 2 && event.target.classList.contains("delete-button")) {
        //stop the hyperlink attached to the image from opening
        event.preventDefault(); 

        //console.log("delete email gallery"); //TEST
        //remove the whole email gallery, as this is the last image
        event.target.parentElement.parentElement.remove(); 
        //delete the email array from the email addresses object
        for (const property in emailAddresses) {
            //check the element's class name to make sure that only the correct email array is deleted
            if(event.target.parentElement.parentElement.classList.contains(`gallery-${property}`)) {
                //let email = property;
                console.log("delete the email array"); //TEST
                delete emailAddresses[property];
                
                //delete emailAddresses.${CSS.escape(property)}; 
                console.log(emailAddresses);
            }
        }
    }

    //if not the last image
    else if(event.target.classList.contains("delete-button")) {

        //stop the hyperlink attached to the image from opening
        event.preventDefault(); 

        //check the elements class name to make sure that only the correct email array is selected
        for (const property in emailAddresses) {
            if(event.target.parentElement.parentElement.classList.contains(`gallery-${property}`)) {
                
                //console.log(property); //TEST

                let arrayKey = emailAddresses[property];
                //console.log(arrayKey); //TEST prints the email array - working correctly.

                //return the class name of the element
                const elementClassName = event.target.parentElement.className;
                const elementPicsumID = elementClassName.slice(9); //from the 9th character
                //console.log(elementPicsumID); //TEST

                //loop through the image objects in the array to search for the correct Picsum ID
                let i = 0;
                let j = 0;
                for (i = 0; i < arrayKey.length; i++) {
                    if(arrayKey[i].id == elementPicsumID) {
                        j = i;
                        console.log(`The deleted image had the index number ${j}`); //TEST to check this is the index number of the item with the same Picsum ID 
                    }      
                }
                arrayKey.splice(j, 1);   
                console.log(`There are ${arrayKey.length} images remaining in this email gallery`); //TEST the number of items remaining in the array
                console.log(emailAddresses); //TEST can use this to check that the correct image has been removed          
            }
        }
        
        //remove only the selected image from the DOM
        event.target.parentElement.remove(); 
    } 
    
})
