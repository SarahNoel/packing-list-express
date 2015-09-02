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


module.exports = {
  List: List,
  ListItem: ListItem,
  Popup:Popup,
  PrintElem:PrintElem,
  cutWhiteSpace:cutWhiteSpace,
  capitalize:capitalize,
  listQuantity:listQuantity,
  renderAll:renderAll,
  activityNames:activityNames,
  checkWeather:checkWeather,
  weatherImage:weatherImage,
  listActivities:listActivities,
  allLists:allLists,
  lists:lists,

}

