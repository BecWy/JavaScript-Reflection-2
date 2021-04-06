//IMPORTANT - will need to use a polyfill for fetch in IE.
//link provided to a polyfill in this article https://css-tricks.com/using-fetch/



let url = "https://picsum.photos/300";
let img = document.querySelector("#picsumImg");

fetch(url)
.then(response => {
    response.blob();
    console.log(response);
    return response.url;
})
.then(data => {
    img.src = data;
    console.log(data);
    //need to push the data (aka the saved URL) to an array that is connected to an email address or something like that. Need to do something with it.
})
.catch(err => {
    //let nm = err.name;
    //let msg = err.message;
    //alert(`CATCH: ${nm} ${msg}`);
    alert("ERROR");
});




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







        // fetch(url)
        // .then(response => {
        //     response.json();
        // })
        // .then(data => {
        //     let str = JSON.stringify(data, null, '\t');
        //     document.querySelector("#output pre").textContent = str;
        // })
        // .catch(err => {
        //     let nm = err.name;
        //     let msg = err.message;
        //     alert(`CATCH: ${nm} ${msg}`);
        // });




