//IMPORTANT - will need to use a polyfill for fetch in IE.
//link provided to a polyfill in this article https://css-tricks.com/using-fetch/



let url = "https://picsum.photos/300";
let img = document.querySelector("#picsumImg");
let img2 = document.querySelector("#gallery-img-1");
let emailInput = document.querySelector("#email");
const skip = document.querySelector("#skip");
const save = document.querySelector("#save");
const formFieldset = document.querySelector("#form-fieldset");

let savedEmailAddress = "test@test.com"; //for testing, will be deleted when no longer needed
let newEmailAddress = emailInput.value;

let emailAddresses = {}; //this object holds all of the email addresses. Each email is its own array, containing an object of image data.

let currentImageURL;


// let allEmailsObject = {
//     "test@example.com": [
//         {
//             id: null,
//             url: null,
//         }
//     ],
//     "test2@example.com": [
//         {
//             id: null,
//             url: null,
//         },
//         {
//             id: null,
//             url: null,
//         }
//     ]
// };






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


//SAVE button - will end up splitting this into a save button and a send email button I think, rather than use the same button twice
save.addEventListener('click', (event) => {
    formFieldset.style.display = "block";
    //IF INPUT IS VALID AND THE DATA CAN BE SUBMITED THEN DO THIS. Otherwise the default HTML validation will do its thing.
    if(emailInput.validity.valid) {
        event.preventDefault();
        event.stopPropagation();
        //console.log("i clicked save");
        newEmailAddress = emailInput.value;

        //need to check if the email address is new, or has been used previously.
        //don't know how to do this yet!!! The below just checks a basic scenario
        //need to check if an object/ array contains the email address or something
        if(newEmailAddress.toLowerCase() === savedEmailAddress.toLowerCase()) {
            //push the image URL to the array that already exists for that email address
            console.log(`the email address is already stored - ${emailInput.value}`);
            savedEmailAddress = newEmailAddress;
        } else {
            //create a new array for the email address. Inside this will be an object with the image data (URL) inside
            
            //create image data object
            let imageDataObject = {
                url: currentImageURL
            };

            //console.log(imageDataObject); //for testing, the object appears to be created correctly
            //console.log(`The current URL is ${currentImageURL}`); //for testing, the url appears correct

            //create email array and push the data in
            let emailArray = [];
            emailArray.push(imageDataObject);
            //console.log(emailArray); //for testing, the array appears to be created correctly and contains the imageDataObject


            //add the email array to the email addresses object as a key (name) and property (the array itself)
            //need to use the variable as a key name
            //example: object[key] = "your_choice";
            emailAddresses[newEmailAddress.toLowerCase()] = emailArray;
            console.log(emailAddresses); //for testing, appears to be working correctly: the email addresses object contains the email array(s) which contains the image data object(s)

            //console.log(`the email address is new - ${emailInput.value}`); for testing, for checking which condition was used
            savedEmailAddress = newEmailAddress;
        }
        //clears the email input field, hides the email input, display a new image
        emailInput.value = "";
        formFieldset.style.display = "none";
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
    //console.log(data);
    return data;
})
.then(data => {
    //console.log(data); //for testing
    img2.style.backgroundImage = `url(${data})`;
}) 
//catch is what needs to happen if there is an error
.catch(err => {
    //let nm = err.name;
    //let msg = err.message;
    //alert(`CATCH: ${nm} ${msg}`);
    alert("ERROR");
});
}





// fetch(url)
// .then(response => {
//     response.json(); // parses JSON response into native JavaScript objects
// })
// .then(data => {
//     img.src = url;
//     //let str = data.stringify();

//     console.log(data)
//     //let str = JSON.stringify(data, null, '\t');
//     //document.querySelector("#output pre").textContent = str;
    
// })
// .catch(err => {
//     let nm = err.name;
//     let msg = err.message;
//     alert(`CATCH: ${nm} ${msg}`);
// });



// let submittedData = {      //the data saved to each object
//     name: nameInput.value, 
//     email: emailInput.value, 
//     phone: phoneInput.value,
//     message: messageInput.value,
// };



