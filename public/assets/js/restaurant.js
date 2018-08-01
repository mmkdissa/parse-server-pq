function Restaurant() {


}

Restaurant.restaurants = [];
Restaurant.nameError = true, Restaurant.contactNameError = true, Restaurant.contactPhoneError = true,
    Restaurant.cityError = true, Restaurant.zipCodeError = true, Restaurant.descriptionError = true,
    Restaurant.countryError = true, Restaurant.stateError = true, Restaurant.addressLine1Error = true;

Restaurant.init = function () {

    $('#editRestaurantButton').hide();
    $("#restaurantCreateView").hide();
    
    $("#restaurantView").show();


    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();
    Restaurant.loadRestaurants();
    Restaurant.loadCuisine();
    Restaurant.loadServiceStyle();
    Restaurant.loadAmbienceStyle();
    $('#addRestaurantIcon').click(Restaurant.clickAddRestaurantIcon);
    $('#deleteRestaurantButton').click(Restaurant.clickDeleteRestaurantIcon);
    $('#restaurantCreateViewBackButton').click(Restaurant.gotoRestaurantView);
    
    
    

    populateCountries("country", "state");


    $('input').focus(function () {

        $(this).siblings('label').addClass('active');
    });

    $('input').blur(function () {


        // Restaurant Name
        if ($(this).hasClass('create-name')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant name').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.nameError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.nameError = false;
            }
        }

        // Restaurant Description
        if ($(this).hasClass('create-description')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant description').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.descriptionError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.descriptionError = false;
            }
        }




        // Restaurant Contact
        if ($(this).hasClass('create-addressline1')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant address').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.addressLine1Error = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.addressLine1Error = false;
            }
        }

        if ($(this).hasClass('create-city')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type city of the restaurant').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.cityError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.cityError = false;
            }
        }

        if ($(this).hasClass('create-zipcode')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type zipcode of the restaurant').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.zipCodeError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.zipCodeError = false;
            }
        }

        if ($(this).hasClass('create-contactName')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type contact persons name').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.contactNameError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.contactNameError = false;
            }
        }

        if ($(this).hasClass('create-contactPhone')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type phone number').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.contactPhoneError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.contactPhoneError = false;
            }
        }


        // label effect
        if ($(this).val().length > 0) {

            $(this).siblings('label').addClass('active');
        } else {
            $(this).siblings('label').removeClass('active');
        }
    });



    $('select').blur(function () {


        // Restaurant Location - Country
        if ($(this).hasClass('create-country')) {
            if ($(this).val() == -1) {
                $(this).siblings('span.error').text('Please select the country').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.countryError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.countryError = false;
            }
        }

        // Restaurant Location - State
        if ($(this).hasClass('create-state')) {
            if ($(this).val() == -1) {
                $(this).siblings('span.error').text('Please select the state').fadeIn().parent('.form-group').addClass('hasError');
                Restaurant.stateError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                Restaurant.stateError = false;
            }
        }





    });


    $('form.basic-form').submit(function (event) {

        event.preventDefault();


        if (Restaurant.nameError == true || Restaurant.descriptionError == true || Restaurant.addressLine1Error == true || Restaurant.countryError == true || Restaurant.stateError == true
            || Restaurant.contactNameError == true || Restaurant.cityError == true || Restaurant.zipCodeError == true || Restaurant.contactPhoneError == true) {
            $('.create-name, .create-description, .create-contact, .create-country,.create-state,.create-addressline1,.label-icon,.create-zipcode,.create-city,.create-contactName,.create-contactPhone').blur();
        } else {

            var RestaurantBiz = Parse.Object.extend("RestaurantBiz");
            var restaurant = new RestaurantBiz();
            var id = $("#id").val();

            if (id) {
                restaurant.id = id;
            }

            var name = $("#name").val();
            var description = $("#description").val();
            var note = $("#note").val();
            var cuisine = $("#cuisineStyle").val();
            var ambience = $("#ambienceStyle").val();
            var service = $("#serviceStyle").val();

            restaurant.set('active', true);
            restaurant.set('name', name);
            restaurant.set('description', description);
            restaurant.set('note', note);
            restaurant.set("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });


            restaurant.set("cuisine", { "__type": "Pointer", "className": "WorldCuisine", "objectId": cuisine });
            restaurant.set("serviceStyle", { "__type": "Pointer", "className": "RestaurantBizServiceStyle", "objectId": service });
            restaurant.set("ambienceStyle", { "__type": "Pointer", "className": "RestaurantBizAmbienceStyle", "objectId": ambience });

            var RestaurantBizContact = Parse.Object.extend("RestaurantBizContact");
            var restaurantBizContact = new RestaurantBizContact();
            var cId = $("#contactId").val();

            if (cId) {
                restaurantBizContact.id = cId;
            }

            var contactName = $("#contactName").val();
            var contactPhone = $("#contactPhone").val();
            var contactEmail = $("#contactEmail").val();


            restaurantBizContact.set("name", contactName);
            restaurantBizContact.set("phone", contactPhone);
            restaurantBizContact.set("email", contactEmail);
            //  var relation = restaurantBizContact.relation("restaurantBiz")
            // relation.add(restaurant);



            var RestaurantBizAddress = Parse.Object.extend("RestaurantBizAddress");
            var restaurantBizAddress = new RestaurantBizAddress();

            var aId = $("#addressId").val();

            if (aId) {
                restaurantBizAddress.id = aId;
            }

            var country = $("#country").val();
            var state = $("#state").val();
            var city = $("#city").val();
            var zipcode = $("#zipcode").val();
            var address = $("#addressline1").val();


            restaurantBizAddress.set('country', country);
            restaurantBizAddress.set('state', state);
            restaurantBizAddress.set('zipCode', zipcode);
            restaurantBizAddress.set('city', city);
            restaurantBizAddress.set('address', address);



            restaurant.set("contact", restaurantBizContact);
            restaurant.set("address", restaurantBizAddress);



            NProgress.start();
            restaurant.save(null).then(
                function (res) {
                    console.log("saved");
                    $('.empty').show();
                    $('.form-peice').hide();
                    setTimeout(function () { NProgress.done(); }, 100);
                    Restaurant.loadRestaurants();
                    $('#restaurantCreateView').hide();
                    $('#restaurantView').show();


                },
                function (error) {
                    console.log("error");
                    $('.empty').show();
                    $('.form-peice').hide();
                    Restaurant.loadRestaurants();
                    $('#restaurantCreateView').hide();
                    $('#restaurantView').show();
                    setTimeout(function () { NProgress.done(); }, 100);

                }
            );
        }




    });


}
Restaurant.gotoRestaurantView = function(event){
    event.preventDefault();
    $("#restaurantCreateView").hide();
    $("#restaurantView").show();
    
}

Restaurant.loadRestaurants = function () {

    var restaurantBiz = Parse.Object.extend("RestaurantBiz");
    var query = new Parse.Query(restaurantBiz);
    query.equalTo("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
    query.include("contact");
    query.include("address");
    NProgress.start();
    Restaurant.restaurants = [];

    query.find().then(
        function (results) {
            var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;
                var name = object.get("name");
                var description = object.get("description");
                var note = object.get("note");
                var cuisine = object.get("cuisine").id;
                var ambienceStyle = object.get("ambienceStyle").id;
                var serviceStyle = object.get("serviceStyle").id;

                var active = object.get("active");

                var country = object.get("address").get("country");
                var state = object.get("address").get("state");
                var zipcode = object.get("address").get("zipCode");
                var city = object.get("address").get("city");
                var address = object.get("address").get("address");
                var addressId = object.get("address").id;


                var contactId = object.get("contact").id;
                var contactName = object.get("contact").get("name");
                var phone = object.get("contact").get("phone");
                var email = object.get("contact").get("email");

                var restaurant = {};
                restaurant.id = id;
                restaurant.name = name;
                restaurant.description = description;
                restaurant.note = note;
                restaurant.cuisineStyle = cuisine;
                restaurant.ambienceStyle = ambienceStyle;
                restaurant.serviceStyle = serviceStyle;
                restaurant.active = active;

                restaurant.country = country;
                restaurant.state = state;
                restaurant.zipcode = zipcode;
                restaurant.city = city;
                restaurant.address = address;
                restaurant.addressId = addressId;

                restaurant.contactId = contactId;
                restaurant.contactName = contactName;
                restaurant.phone = phone;
                restaurant.email = email;

                Restaurant.restaurants.push(restaurant);
                var checked = "";
                if(active){
                    checked = "checked"
                }else{
                    checked = "";
                }


                items += '<li class="list-group-item"'
                    + '"> <label class="switch pull-right"><input type="checkbox" class="restaurant-active" data-id=' + id + '   '+ checked +'>  <span class="slider round"></span> </label>'
                    + '<div class="restaurantName">' + name + '</div>'
                    + '<div>' + address + '</div>'
                    + '<div>' + city + " " + state + " " + zipcode + " " + '</div>'
                    + '<div>' + country + '</div>'
                    + '<div> <p>' + " " + '</p></div>'
                    + '<div>' + contactName + '</div>'
                    + '<div>' + email + '</div>'
                    + '<div>' + phone + '</div>'
                    + '<div class="action-items-restaurant">'
                    + '<a href="" rel="tooltip" title="Orders" data-id=' + id + '>'
                    + '<i class="fas fa-book fa-lg" ></i>'
                    + '</a><a href="" rel="tooltip" title="Menu" data-id=' + id + '>'
                    + '<i class="fas fa-utensils fa-lg" ></i>'
                    + '</a><a href="" rel="tooltip" title="Edit" data-id=' + id + '>'
                    + '<i class="fas fa-edit fa-lg" ></i>'
                    + '</a> <a href=""  rel="tooltip" title="Delete" data-id=' + id + '>'
                    + '<i class="fa fa-trash fa-lg" ></i></a>'
                    + '</div>'
                    + '</li>';
            }
            $('#restaurantList').empty();
            $('#restaurantList').append(items);

            $('.restaurant-active').change(Restaurant.onChangeCheckBox); 
            
            $('#restaurants .action-items-restaurant a').click(Restaurant.selectOption);
            setTimeout(function () { NProgress.done(); }, 100);


        },
        function (error) {
            console.log("error");
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );

}

Restaurant.onChangeCheckBox = function(){
    var id = $(this).attr("data-id");
    if (!$(this).is(':checked')) {
        Restaurant.updateRestaurantState(id, false);
    }else{
        Restaurant.updateRestaurantState(id, true);
    }
}

Restaurant.updateRestaurantState = function(restaurantId,active){
    var RestaurantBiz = Parse.Object.extend("RestaurantBiz");
    var restaurant = new RestaurantBiz();
    restaurant.id = restaurantId;
    restaurant.set("active",active);
    restaurant.save(null);   
}

Restaurant.loadCuisine = function () {
    var cuisine = Parse.Object.extend("WorldCuisine");
    var query = new Parse.Query(cuisine);
    query.ascending("code");
    NProgress.start();

    query.find().then(
        function (results) {

            var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;

                var name = object.get("name");
                var display = object.get("display");

                items += '<option  value=' + id + ' data-name=' + name
                    + '>' + display + '</option>';


            }
            $('#cuisineStyle').empty();
            $('#cuisineStyle').append(items);

            setTimeout(function () { NProgress.done(); }, 100);


        },
        function (error) {
            console.log("error");
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

Restaurant.loadServiceStyle = function () {
    var serviceStyle = Parse.Object.extend("RestaurantBizServiceStyle");
    var query = new Parse.Query(serviceStyle);
    query.ascending("code");
    NProgress.start();

    query.find().then(
        function (results) {

            var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;

                var name = object.get("name");
                var display = object.get("display");

                items += '<option  value=' + id + ' data-name=' + name
                    + '>' + display + '</option>';


            }
            $('#serviceStyle').empty();
            $('#serviceStyle').append(items);

            setTimeout(function () { NProgress.done(); }, 100);


        },
        function (error) {
            console.log("error");
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

Restaurant.loadAmbienceStyle = function () {
    var ambienceStyle = Parse.Object.extend("RestaurantBizAmbienceStyle");
    var query = new Parse.Query(ambienceStyle);
    query.ascending("code");
    NProgress.start();

    query.find().then(
        function (results) {
            var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;

                var name = object.get("name");
                var display = object.get("display");

                items += '<option  value=' + id + ' data-name=' + name
                    + '>' + display + '</option>';


            }
            $('#ambienceStyle').empty();
            $('#ambienceStyle').append(items);

            setTimeout(function () { NProgress.done(); }, 100);


        },
        function (error) {
            console.log("error");
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

Restaurant.clickAddRestaurantIcon = function (event) {
    event.preventDefault();
    $("#restaurantView").hide();
    $("#restaurantCreateView").show();
    $("#name,#description,#note,#zipcode,#city,#addressline1,#addressline2,#contactName,#contactPhone,#contactEmail").siblings('label').removeClass('active');
    $("#name,#description,#note,#zipcode,#city,#addressline1,#addressline2,#contactName,#contactPhone,#contactEmail").val("");
    $("#country").val(-1);
    $("#state").val(-1);
    $("#id").val("");
    $("#contactId").val("");
    $("#addressId").val("");
    $('.empty').hide();
    $('.form-peice').show();
    Restaurant.nameError = true, Restaurant.contactNameError = true, Restaurant.contactPhoneError = true,
    Restaurant.cityError = true, Restaurant.zipCodeError = true, Restaurant.descriptionError = true,
    Restaurant.countryError = true, Restaurant.stateError = true, Restaurant.addressLine1Error = true;
    $('#createRestaurantButton').show();
    $('#editRestaurantButton').hide();




}

Restaurant.selectOption = function (e) {
    e.preventDefault();
    var title = $(this).attr('title');
    var id = $(this).attr('data-id');

    if (title == "Edit") {
        Restaurant.selectRestaurant(id);
    }
    if(title == "Menu"){
        Restaurant.selectMenu(id);
    }
    if(title == "Orders"){
        swal("Function not implemented");
    }
    if(title == "Delete"){
        swal({
            title: "Are you sure?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                Restaurant.deleteSelectedItem(id);
            } else {
              
            }
          });
       
    }
 
}

Restaurant.selectMenu = function(id){
    console.log("Restaurant.selectMenu");
    var restaurant = Restaurant.getSelectedRestaurant(id);
    Menu.init(restaurant);
}

Restaurant.selectRestaurant = function (id) {
    var restaurant = Restaurant.getSelectedRestaurant(id);
    $("#restaurantView").hide();
    $("#restaurantCreateView").show();
    $(".form-peice").show();
    $(".empty").hide();

    $('#createRestaurantButton').hide();
    $('#editRestaurantButton').show();
    // Fill item details
    $("#id").val(restaurant.id);
    $("#contactId").val(restaurant.contactId);
    $("#addressId").val(restaurant.addressId);
    $("#name").focus();
    $("#name").val(restaurant.name);
    $("#description").focus();
    $("#description").val(restaurant.description);
    $("#note").focus();
    $("#note").val(restaurant.note);
    $("#cuisineStyle").focus();
    $("#cuisineStyle").val(restaurant.cuisineStyle);
    $("#ambienceStyle").focus();
    $("#ambienceStyle").val(restaurant.ambienceStyle);
    $("#serviceStyle").focus();
    $("#serviceStyle").val(restaurant.serviceStyle);

    var activeCheckBox = $('#retaurantActive');
    var restaurantStatus = restaurant.active;
    var isTrueSet = (restaurantStatus === 'true');
    if (isTrueSet) {
        activeCheckBox.prop('checked', true);
    } else {
        activeCheckBox.prop('checked', false);
    }



    $("#country").focus();
    $("#country").val(restaurant.country);
    $("#country").change();
    $("#state").focus();
    $("#state").val(restaurant.state);
    $("#zipcode").focus();
    $("#zipcode").val(restaurant.zipcode);
    $("#city").focus();
    $("#city").val(restaurant.city);
    $("#addressline1").focus();
    $("#addressline1").val(restaurant.address);


    $("#contactName").focus();
    $("#contactName").val(restaurant.contactName);
    $("#contactPhone").focus();
    $("#contactPhone").val(restaurant.phone);

    $("#contactEmail").focus();
    $("#contactEmail").val(restaurant.email);
}

// Restaurant.clickDeleteRestaurantIcon = function () {
//     var selectedId = Restaurant.getSelectedItem();
//     console.log(selectedId);

//     if (selectedId != null) {
//         Restaurant.deleteSelectedItem();
//     } else {
//         //sweetAlert("", "Select item to delete", "error");
//     }
// }
Restaurant.deleteSelectedItem = function (id) {
    var RestaurantBiz = Parse.Object.extend("RestaurantBiz");
    var restaurantBiz = new RestaurantBiz();
    restaurantBiz.set('id', id);
    restaurantBiz.destroy(null).then(
        function (res) {
            console.log("saved");
            $('.empty').show();
            $('.form-peice').hide();
            setTimeout(function () { NProgress.done(); }, 100);
            Restaurant.loadRestaurants();


        },
        function (error) {
            console.log("error");
            $('.empty').show();
            $('.form-peice').hide();
            Restaurant.loadRestaurants();
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

Restaurant.getSelectedItem = function () {
    var restaurantId = null;
    $('#restaurantList .list-group-item').each(function () {
        var checkbox = $(this).find('input');
        var checked = checkbox.is(':checked');
        if (checked) {
            restaurantId = checkbox.parent().attr("data-id");
        }
    });
    return restaurantId;
}

Restaurant.getSelectedRestaurant = function (id) {
    for (var i = 0; i < Restaurant.restaurants.length; i++) {
        var restaurant = Restaurant.restaurants[i];
        if (restaurant.id == id) {
            return restaurant;
        }
    }
}