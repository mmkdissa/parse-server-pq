require("./functions/hello");

Parse.Cloud.beforeSave("RestaurantMenuItemGroup", async (request) => {

    //check if this is a new or existing item
    if (request.object.isNew()) {
        var restaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
        var query = new Parse.Query(restaurantMenuItemGroup);
        query.select("code");
        query.descending("code");
        var lastItemGroup = await  query.first();        
        var newId = lastItemGroup.get("code") + 1;
        request.object.set("code", newId);      
    }

});


Parse.Cloud.beforeSave("Worker", function (request) {

    //check if this is a new or existing item
    if (request.object.isNew()) {
        var autoPin = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
        request.object.set("pin", autoPin);       
    }

});

/**
 * Copy Supplied Menu Item Groups in to Restaurant Menu Item Group if they are not already added
 * 
 */
Parse.Cloud.afterSave("RestaurantMenu", function (request) {

    var userId = request.object.get("owner").id;
    var restaurantId = request.object.get("restaurant").id;
    var menuId = request.object.id;
    var menuItemGroupSupplied = Parse.Object.extend("RestaurantMenuItemGroupSupplied");
    var query = new Parse.Query(menuItemGroupSupplied);

    // Find all the Supplied Menu Item Groups
    query.find().then(function (results) {
        // Create a trivial resolved promise as a base case.
        let promise = Promise.resolve();
        results.forEach((result) => {
            // For each item, extend the promise.
            promise = promise.then(() => {
                // Read each and check if its already included in RestaurantMenuItemGroup
                var name = result.get("name");
                var display = result.get("display");
                var note = result.get("note");
                var description = result.get("description");
                var menuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
                var query = new Parse.Query(menuItemGroup);
                query.equalTo("owner", { "__type": "Pointer", "className": "_User", "objectId": userId });
                query.equalTo("restaurant", { "__type": "Pointer", "className": "RestaurantBiz", "objectId": restaurantId });
                query.equalTo("menu", { "__type": "Pointer", "className": "RestaurantMenu", "objectId": menuId });
                query.equalTo("name", name);
                return query.find().then(
                    function (results) {
                        if (results.length == 0) {
                            const menuItemGroupSave = Parse.Object.extend("RestaurantMenuItemGroup");
                            const menuItemGroup = new menuItemGroupSave();

                            menuItemGroup.set("name", name);
                            menuItemGroup.set("display", display);
                            menuItemGroup.set("note", note);
                            menuItemGroup.set("description", description);
                            menuItemGroup.set("owner", { "__type": "Pointer", "className": "_User", "objectId": userId });
                            menuItemGroup.set("restaurant", { "__type": "Pointer", "className": "RestaurantBiz", "objectId": restaurantId });
                            menuItemGroup.set("menu", { "__type": "Pointer", "className": "RestaurantMenu", "objectId": menuId });
                            menuItemGroup.save();
                            console.log("no group found with name" + name);
                        }

                    },
                    function (error) {

                    });
            });
        });
        return promise;

    }).then(function () {
        //response.success(); 

    });

});

