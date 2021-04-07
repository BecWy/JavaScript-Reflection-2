//IMPORTANT - will need to use a polyfill for fetch in IE.
//link provided to a polyfill in this article https://css-tricks.com/using-fetch/



let url = "https://picsum.photos/300";
let img = document.querySelector("#picsumImg");
let img2 = document.querySelector("#gallery-img-1");
let emailInput = document.querySelector("#email");
const skip = document.querySelector("#skip");
const save = document.querySelector("#save");
const formFieldset = document.querySelector("#form-fieldset");

let savedEmailAddress = "test@test.com";
let newEmailAddress = emailInput.value;


let allEmailsObject = {
    "test@example.com": [
        {
            id: null,
            url: null,
        }
    ],
    "test2@example.com": [
        {
            id: null,
            url: null,
        },
        {
            id: null,
            url: null,
        }
    ]
};






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


//SAVE button
save.addEventListener('click', (event) => {
    formFieldset.style.display = "block";
    //IF INPUT IS VALID AND THE DATA CAN BE SUBMITED THEN DO THIS. Otherwise the default HTML validation will do its thing.
    if(emailInput.validity.valid) {
        event.preventDefault();
        event.stopPropagation();
        console.log("i clicked save");
        newEmailAddress = emailInput.value;

        //need to check if the email address is new, or has been used previously.
        //don't know how to do this yet!!! The below just checks a basic scenario
        //need to check if an object/ array contains the email address or something
        if(newEmailAddress.toLowerCase() === savedEmailAddress.toLowerCase()) {
            //push the image URL to the array that already exists for that email address
            console.log(`the email address is already stored - ${emailInput.value}`);
            savedEmailAddress = newEmailAddress;
        } else {
            //create a new array with this image URL saved to it.
            console.log(`the email address is new - ${emailInput.value}`);
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
    console.log(response);
    return response.url;
})
//set the image source to the url that comes back from the API. Also need to reuse this later to attach it to an email
.then(data => {
    img.src = data;
    //console.log(data);
    return data;
})
.then(data => {
    console.log(data);
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



