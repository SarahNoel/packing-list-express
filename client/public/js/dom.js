$(document).on('ready', function() {
  $(this).scrollTop(0);
  //get trip info on submit
  $('#trip-info').on("submit", function(e){
    e.preventDefault();

    var leave = $('#leave').val();
    var length = $('#days').val();
    var destination = $('#location').val().toLowerCase();
    var activities = $('#activities option:selected');
    var activitiesArray = (activityNames(activities));

    //makes sure all forms are filled
    //sets when leaving and length of trip defaults to 1
    if (leave=== ('')) {
      leave = 1;
    }
    if(length === ('')) {
      length = 1;
    }
    if (destination === ('')) {
      alert("Please input a valid city");
    }
    //submit travel form
    else{
      //array of info used for weather images
      var weatherDeets = [];
      var useWeather;
      //hide trip input form
      $('.hide-later').fadeOut();

      // create search URL for getting weather
      var searchUrl = "//api.openweathermap.org/data/2.5/forecast/daily?q=" + destination + "&units=imperial&cnt=16&APPID=30dc5c7ce321f6b73a438b169eb9df48";

      // ajax request
      $.ajax({
        url: searchUrl,
        type: 'GET',
        success:function(data){
          //define variables
          var returnDay = parseFloat(leave) + parseFloat(length);
          var temp = data.list[leave].temp.day.toFixed(0);
          var conditions = data.list[leave].weather[0].description;
          var dailyHigh;
          var dailyLow;
          var dailyDay;
          var dailyConditions;
          var dayNum;
          var start = parseFloat(leave) + 1;
          //accounts for weather api limititations
          if (returnDay > 15) {
            returnDay = 15;
          }

          //print trip details
          if(length < 2){
            $('.trip-deets').append("<h3 class='bigger center'> You are going to " + capitalize(destination) + " for one day!</h3><h4 class='center'> The weather for your trip:</h4>");
          }else{
            $('.trip-deets').append("<h3 class='center'> You are going to " + capitalize(destination) + " for " + length + " days!</h3><h4 class='center'>The weather for your trip:</h4>");
          }

          //print arrival weather conditions
          $(".weather-info").prepend("<p>On the day you arrive, the daytime temperature will be " + temp +" degrees.    The conditions will be:  " + conditions + ". </p><p>The weather the rest of your trip looks like this:</p><p class='tiny'>`(note: forecast only extends 14 days from today)</p>");

          //prints weather conditions for each trip day
          for (var i = start; i <= returnDay; i++) {
            //number of the day of trip (eg, Day 1, Day 2)
            dayNum = i - start + 1;
            dailyLow = data.list[i].temp.min.toFixed(0);
            dailyHigh = data.list[i].temp.max.toFixed(0);
            //daily temp/conditions for determining which list to add
            dailyDay = data.list[i].temp.day.toFixed(0);
            dailyConditions = data.list[i].weather[0].description;
            weatherDeets.push(dailyDay, dailyConditions);
            //print daily info in two rows
            if (dayNum < 8){
              $("#daily-weather").append("<td class= 'weather-box'><span class = 'bolder'>Day " + dayNum + "</span>: <br>Low: " + dailyLow +"<br> High: " + dailyHigh + "<br> Conditions:<br>" + dailyConditions + "</td>");
              }
            if (dayNum > 7){
               $("#daily-weather2").append("<td class= 'weather-box'><span class = 'bolder'>Day " + dayNum + "</span>: <br>Low: " + dailyLow +"<br> High: " + dailyHigh + "<br> Conditions:<br>" + dailyConditions + "</td>");
              }
          }
          //adds lists based on weather
          checkWeather(weatherDeets, activitiesArray);
          //change weather images
          weatherImage (activitiesArray);
          //updates packing list quantities
          listQuantity(lists, length);
          //finds which list to use
          listActivities(activitiesArray, allLists, lists);
          //packing info appears
          $('.invis').fadeIn();
          renderAll(lists);
        },
        error:function(data){
          alert("Sorry we're experiencing technical difficulties accessing the weather. Please try again later.");
        }
      }); //end weather ajax request

      //define vaiables for Instagram
      var imageURLs = [];
      var oneWordDestination = cutWhiteSpace(destination);
      var picUrl = "https://api.instagram.com/v1/tags/" + oneWordDestination + "/media/recent";
      var exploreUrl = "http://www.instagram.com/explore/tags/" + oneWordDestination;
      // Instagram ajax request
      $.ajax({
        url: picUrl,
        type: 'GET',
        data: {client_id:'d04f59826a594c0e8690c8a05a777aa8'},
        dataType:'jsonp',
        success:function(data){
          $("#pic-div").append('<a href="' + exploreUrl + '"><h4>See what people are tagging in ' + capitalize(destination) + '!</h4></a>');
          var output = data.data;
          // iterate through the returned data, appending the images to the dom
          for(var i = 0; i < output.length; i++) {
            imageURLs[i] = output[i].images.thumbnail.url;
            $("#pic-div").append('<img src="' + imageURLs[i] + '"/>');
          }
        }
      }); //end Instagram ajax request

      } //end else statement
    }); //end submit button

  //add new Item to Etc list
  $('#new-item').on("click", function(e){
    e.preventDefault();
    //instantiate new ListItem based on input
    var newItem = new ListItem($("#item").val(), $("#quantity").val());
    //pack item into user List
    userAdd.packItem(newItem);
    renderAll(lists);
    //clears inputs
    $("#item").val("");
    $("#quantity").val("");
  });

  //deletes item
  $(document).on("click", '.delete-click', function(){
    var itemDelete = $(this).prev().html().trim();
    var indexD;
    var listD;
    //removes item from list array
    for (var i = 0; i < lists.length ; i++) {
      for (var j = 0; j < lists[i].list.length; j++) {
        if (itemDelete === lists[i].list[j].itemName){
          itemDelete = lists[i].list[j];
          listD = lists[i];
          indexD = listD.list.indexOf(itemDelete);
          listD.list.splice(indexD, 1);
        }
      }
    }
    //removes item from screen
    $(this).closest('div').remove();
  });

  //checks off list
  $(document).on("click", ".check", function(){
    $(this).toggleClass('checked');
  });

}); //end of document


//List constructor
var List = function(listName){
  this.listName = listName;
  this.list = [];
};

//method for adding Item to List
List.prototype.packItem = function(item) {
  this.list.push(item);
};

//method for removing Item from List
List.prototype.removeItem = function(item) {
  var index;
  index = this.indexOf(item);
  this.splice(index, 1);
};

//method for List
List.prototype.render = function(location){
  location.append("<h3 class = 'bigger'>" + this.listName +"</h3>");
  for (var i = 0; i < this.list.length; i++) {
    location
      .append('<div><li class="check" ><span id="sib">' + this.list[i].itemName + "        "  + '</span><button class="delete-click btn-xs btn-danger"></button></li><li class="quantity-form"><input class="quantity-btn clear-input" type ="number" name="quantity-items" min="0" value ="' + this.list[i].quantity + '"</li><br><br></div>');
  }
};

// add item button
var modalPrintButton = '<input type="submit" value = "Add Item" class="submit" data-toggle="modal" data-target="#myModal">';



//append all Lists in columns
function renderAll(listsArray){
  $("#packing-list").html(" ");
  var end = listsArray.length - 1;
  var lastUL = "#packing"+end;
  for (var i = 0; i < listsArray.length; i++) {
    $('#packing-list').append("<div class = 'span1 packing-list'><ul id = 'packing" + i+"'></ul></div>");
    listsArray[i].render($('#packing'+ i));
  }
  $(lastUL).append(modalPrintButton);
}

//ListItem constructor
var ListItem = function(itemName, quantity){
  this.itemName = itemName;
  this.quantity = quantity || 1;
};

//method for changing quantity of ListItem
ListItem.prototype.changeQuantity = function(num) {
  this.quantity = num;
};

//method for changing name of ListItem
ListItem.prototype.changeItemName = function(name) {
  this.itemName = name;
};

//delete ListItem
ListItem.prototype.deleteItem = function(listDelete){
  index = listDelete.list.indexOf(this);
  listDelete.list.splice(index, 1);
};

//change ListItem amount based on days of travel
//takes in array of all Lists
function listQuantity(listsArray, length) {
  for (var i = 0; i < listsArray.length; i++) {
    for (var j = 0; j < listsArray[i].list.length; j++) {
      if(listsArray[i].list[j].quantity === "day"){
        listsArray[i].list[j].quantity = length;
       }
      else if(listsArray[i].list[j].quantity === "less"){
        if(length > 12){
          listsArray[i].list[j].quantity = 6;
        }
        else if(length > 9){
          listsArray[i].list[j].quantity = 5;
        }
        else if(length === 1){
          listsArray[i].list[j].quantity = 1;
        }
        else{
          listsArray[i].list[j].quantity = parseFloat(length)-1;
        }
      }
    }
  }
  return listsArray;
}

//create array of activity names
function activityNames (activities){
  var activity;
  var activitiesArray = [];
  for (var i = 0; i < activities.length; i++) {
    activity = $(activities[i]).val();
    activitiesArray.push(activity);
  }
  return activitiesArray;
}

//adds list of weather conditions to activity arrray
function checkWeather(weatherArray, activitiesArray){
  var split;
  for (var i = 0; i < weatherArray.length; i++) {
    split = weatherArray[i].split();
    if (split[0].indexOf("rain")!== -1) {
      activitiesArray.push("Rainy Weather");
    }else if(split[0].indexOf("snow")!== -1){
      activitiesArray.push("Cold/Snowy Weather");
    }else if(parseFloat(split[0]) < 40){
      activitiesArray.push("Cold/Snowy Weather");
    }else if(parseFloat(split[0]) > 41 && split[0] < 70){
      activitiesArray.push("Chilly Weather");
    }
  }
  return activitiesArray;
}

//change weather image
function weatherImage (weatherArray){
  if(weatherArray.indexOf("Rainy Weather") != -1){
    $('.square').css('background-image', 'url("../css/rainclear.gif")');
  }else if(weatherArray.indexOf("Cold/Snowy Weather") != -1){
    $('.square').css('background-image', 'url("../css/snowclear.gif")');
  }
}

//adds Lists to array of Lists based on activities
function listActivities (activitiesArray, allListsArray, lists){
  var activity;
  var pushMe;
  for (var i = 0; i < activitiesArray.length; i++) {
    for (var j = 0; j < allListsArray.length; j++) {
      activity = activitiesArray[i];
      if (activity === allListsArray[j].listName){
        pushMe = allListsArray[j];
          if (lists.indexOf(pushMe)===-1){
            lists.splice(3, 0, pushMe);
          }
        }
      }
    }
    return lists;
  }

//capitalizes
function capitalize(string) {
  var splitStr = string.split(' ');
  var fullStr = '';
  $.each(splitStr,function(index){
    var currentSplit = splitStr[index].charAt(0).toUpperCase() + splitStr[index].slice(1);
    fullStr += currentSplit + " ";
  });
  return fullStr;
}

//removes white spaces
function cutWhiteSpace(string) {
  return string.replace(/ /g,'');
}


//print functions
//create print element
function PrintElem(elem){
  Popup($(elem).html());
}

//create pop-up for printing
function Popup(data) {
  var mywindow = window.open('', 'my div', 'height=400,width=650');
  mywindow.document.write('<html><head><title>Do I have Everything?</title>');
  mywindow.document.write("<link href='http://fonts.googleapis.com/css?family=Dosis' rel='stylesheet' type='text/css'><link rel='stylesheet' href='css/mainPrint.css' type='text/css'>");
  mywindow.document.write('</head><body >');
  mywindow.document.write(data);
  mywindow.document.write('</body></html>');
  mywindow.print();
  // mywindow.close();
}


//LIST ITEMS

//standard items
//clothes
var bottoms = new ListItem('Bottoms', 'less');
var tops = new ListItem('Tops', 'day');
var shoes = new ListItem('Shoes');
var socks = new ListItem('Socks', 'day');
var underwear = new ListItem('Underwear', 'day');
var pjs = new ListItem('Pajamas', 'less');
var belt = new ListItem('Belt');
var jewelry = new ListItem('Jewelry');

//toiletries
var soap = new ListItem('Soap');
var shampoo = new ListItem('Shampoo/Cond.');
var toothbrush = new ListItem('Toothbrush');
var toothpaste = new ListItem('Toothpaste');
var floss = new ListItem('Floss');
var brush = new ListItem('Brush/Comb');
var blowDryer = new ListItem('Blow Dryer');
var contact = new ListItem('Contact Lens/Sol.');
var deodorant = new ListItem('Deodorant');
var face = new ListItem('Face Cleaner');
var sunscreen = new ListItem('Sunscreen');
var lotion = new ListItem('Lotion');
var razor = new ListItem('Razor');
var cream = new ListItem('Shaving Cream');
var makeup = new ListItem('Makeup');
var medication = new ListItem('Medication');
var lip = new ListItem('Lip Balm');
var vitamins = new ListItem('Vitamins');
var firstAidKit = new ListItem('First Aid Kit');

//misc
var phone = new ListItem('Phone');
var charger = new ListItem('Phone Charger');
var computer = new ListItem('Computer/Charger');
var tablet = new ListItem('Tablet/Charger');
var headphones = new ListItem('Headphones');
var book = new ListItem('Books/eReader');
var keys = new ListItem('Keys');
var cash = new ListItem('Cash');
var wallet = new ListItem('Wallet');
var passport = new ListItem('Passport');
var camera = new ListItem('Camera');
var insurance = new ListItem('Insurance Info');


//specialty items
//swim vacation
var swimsuit = new ListItem('Swimsuit');
var towel = new ListItem('Towel');
var beachUmbr = new ListItem('Beach Umbrella');
var sandals = new ListItem('Sandals');
var beachBag = new ListItem('Beach Bag');
var sunglasses = new ListItem('Sunglasses');
var sunHat = new ListItem('Sun Hat');
var coverUp = new ListItem('Cover Up');
var beachChair = new ListItem('Beach Chair');
var aloeVera = new ListItem('Aloe Vera');

//ski vacation
var skiBoots = new ListItem('Ski Boots');
var skis = new ListItem('Skis/Board');
var helmet = new ListItem('Helmet');
var layers = new ListItem('First Layer');
var goggles = new ListItem('Goggles');
var skiSocks = new ListItem('Thick Socks');
var skiCoat = new ListItem('Ski Coat');
var snowPants = new ListItem('Snow Pants');

//additional items
//for cold
var sweater = new ListItem('Sweater');
var coat = new ListItem('Coat');

//for rain
var raincoat = new ListItem('Raincoat');
var umbrella = new ListItem('Umbrella');
var rainBoots = new ListItem('Rain Boots');

// for snow
var snowBoots = new ListItem('Snow Boots');
var beanie = new ListItem('Hat/Beanie');
var gloves = new ListItem('Gloves');
var scarf = new ListItem('Scarf');

//for camping
var tent = new ListItem('Tent');
var stakes = new ListItem('Stakes');
var stove = new ListItem('Cooking Stove');
var matches = new ListItem('Matches');
var lantern = new ListItem('Lantern');
var sleepingBag = new ListItem('SleepingBag');
var rope = new ListItem('Rope');
var food = new ListItem('Food');
var water = new ListItem('Water');

//for hiking
var hikingBoots = new ListItem('Hiking Boots');
var woolSocks = new ListItem('Wool Socks');
var bugSpray = new ListItem('Bug Spray');
var backpack = new ListItem('Backpack');
var jacket = new ListItem('Jacket');
var tp = new ListItem('Toilet Paper');


//-----------------------------------------------------------------

//LISTS
//chilly list- 50-70
var chillyList= new List("Chilly Weather");
chillyList.list = [
  sweater,
  jacket
];


//cold list - < 50 or snow
var coldList = new List("Cold/Snowy Weather");
coldList.list = [
  sweater,
  coat,
  snowBoots,
  beanie,
  gloves,
  scarf
];

//rain list - rain
var rainList = new List("Rainy Weather");
rainList.list = [
  sweater,
  raincoat,
  umbrella,
  rainBoots
];

//camp list
var campList = new List("Camping");
campList.list = [
  tent,
  stakes,
  stove,
  matches,
  lantern,
  sleepingBag,
  rope,
  food,
  water
];

//hiking list
var hikeList = new List("Hiking");
hikeList.list = [
  hikingBoots,
  woolSocks,
  bugSpray,
  backpack,
  jacket,
  water,
  tp
];


//swim list
var swimTrip = new List("Swimming");
swimTrip.list = [
  swimsuit,
  towel,
  beachUmbr,
  sandals,
  beachBag,
  sunglasses,
  sunHat,
  coverUp,
  beachChair,
  aloeVera
];


//ski list
var skiTrip = new List("Ski/Snowboard");
skiTrip.list = [
  skiBoots,
  skis,
  snowBoots,
  beanie,
  gloves,
  scarf,
  helmet,
  layers,
  goggles,
  skiSocks,
  skiCoat,
  snowPants,
];


//pre-populated general lists
var userAdd = new List("Your List");
userAdd.list = [];

//clothing list
var standardClothes = new List("Clothes");
standardClothes.list = [
  bottoms,
  tops,
  shoes,
  socks,
  underwear,
  pjs,
  belt,
  jewelry
];

//toiletries list
var standardToiletries = new List("Toiletries");
standardToiletries.list = [
 soap,
 shampoo,
 toothbrush,
 toothpaste,
 floss,
 brush,
 blowDryer,
 contact,
 deodorant,
 face,
 sunscreen,
 lotion,
 razor,
 cream,
 makeup,
 medication,
 lip,
 vitamins,
 firstAidKit
];

//misc list
var standardMisc = new List("Miscellaneous");
standardMisc.list = [
 phone,
 charger,
 computer,
 tablet,
 headphones,
 book,
 keys,
 cash,
 wallet,
 passport,
 camera,
 insurance
];

//all Lists
var allLists = [standardClothes, standardToiletries, standardMisc, userAdd, skiTrip, swimTrip, campList, hikeList, rainList, coldList, chillyList];

//standard lists for all occasions
var lists = [standardClothes, standardToiletries, standardMisc, userAdd];
