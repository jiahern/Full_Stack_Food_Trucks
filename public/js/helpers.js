var register = function(Handlebars) {
    var helpers = { // add all helpers as key: value pairs
        displayRating: function(order){
            var ret = ""
            if (order.rating == 0){
                ret = ret +
                    "<span>Rating:</span>" +
                    "<span class=\"rate-display-dark\"></span>" + 
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>"
            }

            else if (order.rating == 1){
                ret = ret +
                    "<span>Rating:</span>" +
                    "<span class=\"rate-display-shine\"></span>" + 
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>"
            }

            else if (order.rating == 2){
                ret = ret +
                    "<span>Rating:</span>" +
                    "<span class=\"rate-display-shine\"></span>" + 
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>"
            }

            else if (order.rating == 3){
                ret = ret +
                    "<span>Rating:</span>" +
                    "<span class=\"rate-display-shine\"></span>" + 
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-dark\"></span>" +
                    "<span class=\"rate-display-dark\"></span>"
            }

            else if (order.rating == 4){
                ret = ret +
                    "<span>Rating:</span>" +
                    "<span class=\"rate-display-shine\"></span>" + 
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-dark\"></span>"
            }

            else {
                ret = ret +
                    "<span>Rating:</span>" +
                    "<span class=\"rate-display-shine\"></span>" + 
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-shine\"></span>" +
                    "<span class=\"rate-display-shine\"></span>"
            }

            return ret;
        },        




        listOrders: function(orders){
            var ret = ""
            if(orders.length == 0){
                ret = ret + 
                    "<div class = \"no-past-orders\">" +
                        "<h1>You have no past orders&#129534; &nbsp;Let's place your first order...&#9749;</h1>" +
                    "</div>"
            }

            else{
                for (var i = 0, j = orders.length; i < j; i++) {
                
                    var totalquantity = 0

                    for (var x = 0; x < orders[i].items.length; x++){
                        totalquantity = totalquantity + orders[i].items[x].quantity
                    }

                    ret = ret + "<a href=\"/customer/pastOrderDetails/" + orders[i]._id + "\">"
                    ret = ret +                
                        "<div class=\"singleOrders\">" +                       
                            "<h3 class=\"order-van-name\">" + orders[i]._vanID.name + "</h3>" +
                            "<p class=\"order-itemnum\">" + totalquantity + " items &nbsp;&nbsp;&nbsp;Total Price: $" + orders[i].totalPrice + "</p>" +
                            "<p class=\"order-establish-time\">"+ orders[i].orderTime + "</p>" +                        
                        "</div>"
                    ret = ret + "</a>" 
                }
            }

            return ret 
        },

        listitem: function (items) { 
            var ret = "<container class=\"confirmContainer\">";
            for (var i = 0, j = items.length; i < j; i++) {
                ret = ret +                
                    "<div class=\"singleItem\">" +                       
                        "<img class = \"itemImage\" src=\""+ items[i]._itemID.image+"\"></img>"+
                        "<p class = \"itemInfo\">"+items[i]._itemID.name+"<br>"+
                        "<span class = \"transparent\">"+items[i]._itemID.size+"<br>"+
                        "Sugar: "+items[i]._itemID.sugar+"<br>"+
                        "Ice: "+items[i]._itemID.ice+"<br>"+
                        "Quantity: "+items[i].quantity+"   Price:$"+items[i]._itemID.singlePrice*items[i].quantity +"</span></p>"+                        
                    "</div>"                
            }
            return ret + "</container>";
        },

        cartListitem: function (order) {         
            var ret = "<container class=\"confirmContainer\">";
            for (var i = 0, j = order.items.length; i < j; i++) {
                ret = ret +                
                    "<div class=\"singleItem\">" +                       
                        "<img class = \"itemImage\" src=\""+ order.items[i]._itemID.image+"\"></img>"+
                        "<p class = \"itemInfo\">"+order.items[i]._itemID.name+"<br>"+
                        "<span class = \"transparent\">"+order.items[i]._itemID.size+"<br>"+
                        "Sugar: "+order.items[i]._itemID.sugar+"<br>"+
                        "Ice: "+order.items[i]._itemID.ice+"<br>"+
                        "Quantity: "+
                        "<a href=\"/customer/reduceQuan/"+order.items[i]._itemID._id +"\"> - </a>"+
                        order.items[i].quantity+
                        "<a href=\"/customer/increaseQuan/"+order.items[i]._itemID._id +"\"> + </a>"+   
                        "Price:$"+order.items[i]._itemID.singlePrice*order.items[i].quantity +"</span></p>"+                        
                    "</div>"                
            }
            return ret + "</container>";
        },

        // layout of the fixed menu page 
        menuItemsfix: function (items) { 
            var ret = "<div class=\"w-layout-grid menu-grid\">";
            for (var i = 0, j = items.length; i < j; i++) {
                if (items[i].type == "Drink"){
                    ret = ret +
                    "<div id=\"w-node-a81d5bce-dbf4-da03-cf21-8a6b00627f3d-472c9533\" class=\"menu-div\">" +
                        "<img src=\"" + items[i].image + "\"" + " loading=\"lazy\" sizes=\"(max-width: 479px) 208px, (max-width: 1919px) 258px, 358px\" srcset=\"" + items[i].image + " 500w," + items[i].image + " 800w\" class=\"menu-image\">" +
                        "<p class=\"menu-para\"><br>" + items[i].name + "<br>" + "$" + items[i].singlePrice+ "</p>"+
                        "<div class=\"form-block-2 w-form\">"+
                            "<form action = \"/customer/addToCart\" method = \"POST\" id=\"email-form\" name=\"email-form\" data-name=\"Email Form\">" + 
                                // name(key in the req.body) of the size input is "Customize-Size-" + i (Used for POST method query)
                                "<label class=\"customize-label\">Size:</label>"+
                                "<select required=\"\" name=\"size\" class=\"customize-input w-select\">"+
                                    "<option value=\"\">Select one...</option>"+
                                    "<option value=\"Large\">Large</option>"+
                                    "<option value=\"Regular\">Regular</option>"+
                                    "<option value=\"Small\">Small</option>"+
                                "</select>"+

                                // name(key in the req.body) of the sugar input is "Customize-Sugar-" + i (Used for POST method query)
                                "<label class=\"customize-label\">Sugar:</label>"+
                                "<select required=\"\" name=\"sugar\" class=\"customize-input w-select\">"+
                                    "<option value=\"\">Select one...</option>"+
                                    "<option value=\"Normal\">Normal</option>"+
                                    "<option value=\"Half\">Half</option>"+
                                    "<option value=\"Sugar Free\">Sugar Free</option>"+
                                "</select>"+
                                
                                // name(key in the req.body) of the ice input is "Customize-Ice-" + i (Used for POST method query)
                                "<label class=\"customize-label\">Ice:</label>"+
                                "<select required=\"\" name=\"ice\" class=\"customize-input w-select\">"+
                                    "<option value=\"\">Select one...</option>"+
                                    "<option value=\"Normal\">Normal</option>"+
                                    "<option value=\"Less\">Less</option>"+
                                    "<option value=\"Ice free\">Ice free</option>"+
                                "</select>"+

                                // hidden input inherited from the old menu template (might be used)
                                "<input type=\"hidden\" name=\"foodName\" value=\'" + items[i].name + "\'>"+
                                "<input type=\"submit\" value=\"ADD TO CART\" data-wait=\"Please wait...\" class=\"add-to-cart-submit-btn w-button\">"+
                            "</form>" +
                        "</div>"+
                    "</div>"
                }

                else{
                    ret = ret +
                    "<div id=\"w-node-a81d5bce-dbf4-da03-cf21-8a6b00627f3d-472c9533\" class=\"menu-div\">" +
                        "<img src=\"" + items[i].image + "\"" + " loading=\"lazy\" sizes=\"(max-width: 479px) 208px, (max-width: 1919px) 258px, 358px\" srcset=\"" + items[i].image + " 500w," + items[i].image + " 800w\" class=\"menu-image\">" +
                        "<p class=\"menu-para\"><br>" + items[i].name + "<br>" + "$" + items[i].singlePrice+ "</p>"+
                        "<div class=\"form-block-2 w-form\">"+
                            "<form action = \"/customer/addToCart/\" method = \"POST\" id=\"email-form\" name=\"email-form\" data-name=\"Email Form\" >" + 
                                // name(key in the req.body) of the size input is "Customize-Size-" + i (Used for POST method query)
                                "<label class=\"customize-label\">Size:</label>"+
                                "<select required=\"\" name=\"size\" class=\"customize-input w-select\">"+
                                    "<option value=\"\">Select one...</option>"+
                                    "<option value=\"Regular\">Regular</option>"+
                                "</select>"+

                                // name(key in the req.body) of the sugar input is "Customize-Sugar-" + i (Used for POST method query)
                                "<label class=\"customize-label\">Sugar:</label>"+
                                "<select required=\"\" name=\"sugar\" class=\"customize-input w-select\">"+
                                    "<option value=\"\">Select one...</option>"+
                                    "<option value=\"Normal\">Normal</option>"+                           
                                "</select>"+
                                
                                // name(key in the req.body) of the ice input is "Customize-Ice-" + i (Used for POST method query)
                                "<label class=\"customize-label\">Ice:</label>"+
                                "<select required=\"\" name=\"ice\" class=\"customize-input w-select\">"+
                                    "<option value=\"\">Select one...</option>"+
                                    "<option value=\"Ice free\">Ice free</option>"+
                                "</select>"+

                                // hidden input inherited from the old menu template (might be used)
                                "<input type=\"hidden\" name=\"foodName\" value=\'"  + items[i].name + "\'/>"+
                                "<input type=\"submit\" value=\"ADD TO CART\" data-wait=\"Please wait...\" class=\"add-to-cart-submit-btn w-button\">"+
                            "</form>" +
                        "</div>"+
                    "</div>"

                }
            }
            return ret + "</div>";
        },
        
        listFulfillingOrders_V: function(orders){
            var ret = ""
            if(orders.length == 0){
                ret = ret 
            }

            else{
                for (var i = 0; i < orders.length; i++) {
                    
                    var totalquantity = 0

                    for (var x = 0; x < orders[i].items.length; x++){
                        totalquantity = totalquantity + orders[i].items[x].quantity
                    }
                        if (orders[i].status == "fulfilling"){
                        ret = ret + "<a href=\"/vendor/fulfillingDetails/" + orders[i]._id  + "\">"
                        ret = ret +                
                            "<div class=\"card-body\">" +                       
                                "<h3 class=\"order-van-name\">" + orders[i]._customerID.firstname + " " + orders[i]._customerID.lastname +  " " + orders[i].orderID +"</h3>" +
                                "<p class=\"order-itemnum\">" + totalquantity + " items &nbsp;&nbsp;&nbsp;Total Price: $" + orders[i].totalPrice + "</p>" +
                            "</div>"
                        ret = ret + "</a>" 
                        }
                }
            }

            return ret 
        },


        listFulfilledOrders_V: function(orders){
            var ret = ""
            if(orders.length == 0){
                ret = ret 
            }

            else{
                for (var i = 0, j = orders.length; i < j; i++) {
                    
                    var totalquantity = 0

                    for (var x = 0; x < orders[i].items.length; x++){
                        totalquantity = totalquantity + orders[i].items[x].quantity
                    }
                        if (orders[i].status == "fulfilled"){
                        ret = ret + "<a href=\"/vendor/fulfilledDetails/" + orders[i]._id + "\">"
                        ret = ret +                
                            "<div class=\"card-body\">" +                       
                                "<h3 class=\"order-van-name\">" + orders[i]._customerID.firstname + " " + orders[i]._customerID.lastname +  " " + orders[i].orderID +"</h3>" +
                                "<p class=\"order-itemnum\">" + totalquantity + " items &nbsp;&nbsp;&nbsp;Total Price: $" + orders[i].totalPrice + "</p>" +
                            "</div>"
                        ret = ret + "</a>" 
                        }
                }
            }

            return ret 
        },

        listCompleteOrders_V: function(orders){
            var ret = ""
            if(orders.length == 0){
                ret = ret 
            }

            else{
                for (var i = 0, j = orders.length; i < j; i++) {
                    
                    var totalquantity = 0

                    for (var x = 0; x < orders[i].items.length; x++){
                        totalquantity = totalquantity + orders[i].items[x].quantity
                    }
                        if (orders[i].status == "complete"){
                        ret = ret + "<a href=\"/vendor/completeDetails/" + orders[i]._id + "\">"
                        ret = ret +                
                            "<div class=\"card-body\">" +                       
                                "<h3 class=\"order-van-name\">" + orders[i]._customerID.firstname + " " + orders[i]._customerID.lastname +  " " + orders[i].orderID +"</h3>" +
                                "<p class=\"order-itemnum\">" + totalquantity + " items &nbsp;&nbsp;&nbsp;Total Price: $" + orders[i].totalPrice + "</p>" +
                            "</div>"
                        ret = ret + "</a>" 
                        }
                }
            }

            return ret 
        },




        listFulfillingitem: function (items) { 
            var ret = "<container class=\"confirmContainer\">";
            for (var i = 0, j = items.length; i < j; i++) {
                ret = ret +                
                    "<div class=\"card-body\">" + 
                    "<h3>"+ (i+1) + ". " + items[i]._itemID.name + "</h3>" + "<br>"+
                        "<span class = \"transparent\">"+items[i]._itemID.size+"<br>"+
                        "Sugar: "+items[i]._itemID.sugar+"<br>"+
                        "Ice: "+items[i]._itemID.ice+"<br>"+
                        "Quantity: "+items[i].quantity+                    
                    "</div>"                
            }
            return ret + "</container>";
        },


        listFulfilleditem: function (items) { 
            var ret = "<container class=\"confirmContainer\">";
            for (var i = 0, j = items.length; i < j; i++) {
                ret = ret +                
                    "<div class=\"card-body\">" +  
                    "<h3>"+ (i+1) + ". " + items[i]._itemID.name + "</h3>" + "<br>"+
                        "<span class = \"transparent\">"+ 
                        items[i]._itemID.size+"<br>"+
                        "Sugar: "+items[i]._itemID.sugar+"<br>"+
                        "Ice: "+items[i]._itemID.ice+"<br>"+
                        "Quantity: "+items[i].quantity+                    
                    "</div>"                
            }
            return ret + "</container>";
        },


        listCompleteitem: function (items) { 
            var ret = "<container class=\"confirmContainer\">";
            for (var i = 0, j = items.length; i < j; i++) {
                ret = ret +                
                    "<div class=\"card-body\">" + 
                    "<h3>"+ (i+1) + ". " + items[i]._itemID.name + "</h3>" + "<br>"+
                        "<span class = \"transparent\">"+items[i]._itemID.size+"<br>"+
                        "Sugar: "+items[i]._itemID.sugar+"<br>"+
                        "Ice: "+items[i]._itemID.ice+"<br>"+
                        "Quantity: "+items[i].quantity +                     
                    "</div>"                
            }
            return ret + "</container>";
        },



        totalPrice: function (items) {
            var price = 0
            for (var i = 0, j = items.length; i < j; i++){
                var singlePrice = items[i]._itemID.singlePrice
                var quantity = items[i].quantity
                var subtotal = singlePrice*quantity
                price += subtotal
            }
            return price
        },

        note: function(noteContent) {
            if (noteContent){
                return "<div class=\"noteArea\"><p>Note: " + noteContent + "</p></div>"                  
            } 
            return ""     
        },

        comment: function(commentContent) {
            if (commentContent){
                return "<div class=\"noteArea\"><p>Comment: " + commentContent + "</p></div>"                  
            } 
            return ""     
        },

        discountapplied: function(order) {
            
            if (order.subTotal != order.totalPrice){
                return "<div class=\"discount\"><p style=\"color:red;\">Discount: " +"( $" + (order.subTotal - order.totalPrice) + " )"+"</p></div>"                  
            } 
            return "<div class=\"discount\"><p>Discount: " +"Not Applied" + "</p></div>"      
        },

        

        samePrice: function(subTotal, totalPrice){
            if (subTotal !== totalPrice){
                const discountPrice = parseFloat(subTotal - totalPrice).toFixed(2); 
                return "<h3 style=\"color:red;\">Discount:$" + discountPrice +"</h3>"
            }else{
                return ;
            }
        },

        /*menuItems: function (customerID, items) { 
            var ret = "<div id=\"menu-display\"> <div id=\"menu-grid\">";
            for (var i = 0, j = items.length; i < j; i++) {
                ret = ret +
                    "<div class=\"item\">" +
                        "<img class = \"menu-pic\" src=\""+ items[i].image + "\">" +
                        "<p>"+items[i].name+"<br>"+ "$"+items[i].singlePrice + "</p>"+
                        "<form action = \"/customer/addToCart/" + customerID + "\"" + " method = \"POST\">" + 
                            "<input type=\"hidden\" name=\"foodID\" value="  + items[i]._id + "/>"+
                            "<button class=\"button-cart\">Add to Cart</button>"+
                        "</form>"  +
                    "</div>"
            }
            return ret + "</div> </div>";
        },*/

    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      // for each helper defined above 
      for (var prop in helpers) {
          // we register helper using the registerHelper method
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  // export helpers to be used in our express app
  module.exports.register = register;
  module.exports.helpers = register(null); 