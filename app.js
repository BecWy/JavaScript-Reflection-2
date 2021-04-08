//IMPORTANT - will need to use a polyfill for fetch in IE.
//link provided to a polyfill in this article https://css-tricks.com/using-fetch/


let url = "https://picsum.photos/300";
let img = document.querySelector("#picsumImg");
let img2 = document.querySelector("#gallery-img-1");
let emailInput = document.querySelector("#email");
const skip = document.querySelector("#skip");
const save = document.querySelector("#save");
const formFieldset = document.querySelector("#form-fieldset");

let newEmailAddress = emailInput.value; //the email address that has just been input
let savedEmailAddress = "test@testtesttest.com"; //when the for...in loop checks if an email address already exists it will save an existing email address to here
let emailAddresses = {}; //this object holds all of the email addresses. Each email is its own array, containing an object of image data.
let currentImageURL; 

const gallery = document.querySelector(".gallery-image-containers");



//EVENT LISTENERS ////////////////////////////////////////////////////////////////////////////////

//Page loaded event listener
document.addEventListener('DOMContentLoaded', () => {
    fetchImage();
    formFieldset.style.display = "none";
})

///Button event listeners

//SKIP button
//use the fetch function above to get a new image
skip.addEventListener('click', () => {
    fetchImage();
})


//SAVE button - will end up splitting this into a save button and a send/submit email button I think, rather than use the same button twice
save.addEventListener('click', (event) => {
    formFieldset.style.display = "block";
    //IF INPUT IS VALID AND THE DATA CAN BE SUBMITED THEN DO THIS. Otherwise the default HTML validation will do its thing.
    if(emailInput.validity.valid) {
        event.preventDefault();
        event.stopPropagation();
        newEmailAddress = emailInput.value;

        //attempt at using a for..in loop to check previous email addresses
        for (const property in emailAddresses) {
            if(newEmailAddress.toLowerCase() === property) {

                console.log(`The email address already exists: ${property}`);

                 //create image data object
                let imageDataObject = {
                    url: currentImageURL
                };

                //push this image data object onto the existing array
                emailAddresses[property].push(imageDataObject);

                //save the property to the savedEmailAddress email so that if the object hasn't been created here 
                //then a new email address array is created below after comparing the current email address with the saved email address
                savedEmailAddress = property;

            }
        }
          
        //checks if the email address has been used previously. If it hasn't then it creates a new email address array with the image data inside
        if(newEmailAddress.toLowerCase() !== savedEmailAddress.toLowerCase()) {
            
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
            console.log(`the email address is new - ${emailInput.value}`); //for testing, checking which condition was used
        }

        //GALLERY
         ///need to add images to the gallery
        //need to create objects? Use divs so that the image can be added as a background image and will therefore resize for
        //different screen sizes
        //one div per array? or one per image? or a slideshow of images for each array
        //each time an email address array is created it creates a container div?
        //and then each time an image data object is created it creates a div within the parent container?
        //need to work out how to append each item.

        //CREATE ELEMENT EXAMPLE
        //how am I going to make sure that the image div is added to the correct email div?
        //can I add a class name, which uses the 'property' value in the for...in loop?
        // so whenever an email array is created it is given the class name gallery-${property}
        //I can then add the image to the object with the class name gallery-${property} 
        
        let emailContainer = document.createElement("div");   // Create a div element for the email address, but only when this is first created
        //let imageContainer = document.createElement("div");  // Create a div element for the image, everytime an image object is created
        let imageContainer = document.createElement("img");  // Create a img element for the image, everytime an image object is created

        emailContainer.appendChild(imageContainer);            // Append image to email address container
        gallery.appendChild(emailContainer);                  //append email address container to the gallery
        
        //imageContainer.style.backgroundImage = `url(${currentImageURL})`;
        imageContainer.src = currentImageURL;
        
    

        // fetch(currentImageURL)
        // .then(response => { 
        //     imageContainer.style.backgroundImage = `url(${response.url})`; //add image as a background image so it can be resized
        // })

        
        

        




        //RESET
        //clears the email input field, hides the email input, display a new image
        emailInput.value = "";
        formFieldset.style.display = "none";
        console.log(emailAddresses); //for testing, appears to be working correctly 
        fetchImage();
    }
})


const fetchImage = () => {
    fetch(url)
///get the data we need (aka the specific image's url) from the response
.then(response => { 
    response.blob();
    //console.log(response);
    return response.url;
})
//set the image source to the url that comes back from the API. Also need to reuse this later to attach it to an email
.then(data => {
    img.src = data;
    currentImageURL = data;
    //img2.style.backgroundImage = `url(${currentImageURL})`; //remove when certain no longer needed for testing
})
//catch is what needs to happen if there is an error
.catch(err => {
    alert("Please refresh the page");
});
}




