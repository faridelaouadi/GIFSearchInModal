//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms, 5 second for example
var $input = $('#text');

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  if($(this).val()!=""){
    typingTimer = setTimeout(searchGifs, doneTypingInterval);
  }else{
    console.log("The user cleared the input field and wants to search for something else")
    document.getElementById("gifModalBody").innerHTML = "";
  }
});

//on keydown, clear the countdown
$input.on('keydown', function () {
  const key = event.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
        document.getElementById("gifModalBody").innerHTML = "";
    }
  clearTimeout(typingTimer);
});

function searchGifs(){
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest()

  // Open a new connection, using the GET request on the URL endpoint
  var query = document.getElementById("text").value
  request.open('GET', 'https://api.giphy.com/v1/gifs/search?api_key=ZsDhKYMNVtzRxcbGwrOBKhNElDE4ZRDv&q='+query+'&limit=25&offset=0&rating=G&lang=en', true)

  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      //console.log(data["data"][0]["images"]["hd"]["mp4"])
      var image_counter = 0; // we will use this to know which image is currently clicked
      var image_clicked;
      data["data"].forEach(value => {
        //console.log(value)
        var img = document.createElement('img');
        img.setAttribute('data-image_number', image_counter)
        img.src =  value["images"]["fixed_height_downsampled"]["url"];
        img.style.margin = "5px";
        img.addEventListener("click", () => {
          //change the border of the image
          if (image_clicked){
            document.querySelector("img[data-image_number="+CSS.escape(image_clicked)+"]").style.border = 0;}
          image_clicked = img.getAttribute('data-image_number')
          img.style.border = "4px solid #0000ff";
          //console.log("you clicked the image with link ---> " + img.getAttribute('data-image_number'));
        });
        document.getElementById("gifModalBody").appendChild(img);
        image_counter += 1;
      })
      //show modal
      $("#gifModal").modal();
  }
};

// Send request
request.send()
};

function closeGifModal(){
  document.getElementById("gifModalBody").innerHTML = "";
  document.getElementById("text").value = "";
  //this is the same as doing .innerHTML = '' however it is faster apparently
  $('#gifModal').modal('toggle');
}
