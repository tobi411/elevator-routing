// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).ready(function(){

		//position: position in building from left to right
		function Elevator(position)
		{
			this.destination = 0;
			this.currentLocation = 1;
			this.defaultLocation = 1; //not sure too
			this.isTransporting = false;
			this.position = position; //not sure yet
			this.queue = [];
			this.move = function(destination){
				console.log("moving to "+ destination);
				this.destination = destination;
				this.currentLocation = destination; //REMOVE THIS!!!!
			}
		}

		function Request(callFrom,direction)
		{
			this.callFrom = callFrom;
			this.direction = direction;
		}

		//a queue of requests
		var queue = [];

		var elevator1 = new Elevator(1);
		var elevator2 = new Elevator(2);
		var elevator3 = new Elevator(3);

		elevator1.move(1);
		elevator2.move(2);
		elevator3.move(3);

		var allElevators = [elevator1, elevator2, elevator3];

        $("[id*='request']").click(function(e) {
        	var buttonId = $(this).attr('id');
        	$(this).children().addClass("buttonClicked");
        	var data = buttonId.split("-");

        	if (!requestInArray(queue,data[2],data[1])) {
	        	var request = new Request(data[2],data[1]);
	            console.log('button '+ buttonId +' clicked!');
	            queue.push(request);
	            console.log(queue);
	            dispatchElevator();
        	};
        });

        var dispatchElevator = function(){
        	console.log("here");
        	var dispathedElevator = getAppropriateElevator();
        };

        function getAppropriateElevator(){
        	var currRequest = queue.shift();
        	var elevatorToDispatch = null;
        	elevatorToDispatch = anyElevatorOnCurrFloor(currRequest);
        	console.log(elevatorToDispatch);
        	if(elevatorToDispatch !== null)
        	{
        		allElevators[elevatorToDispatch.position - 1].queue.push(currRequest);
        	}else{
        		// elevatorToDispatch.
        	}

        	// while(i < allElevators.length && !found){
        	// 	var currElevator = allElevators[i];

        	// 	//check if there is an elevator on this location or one going to this location
        	// 	if(currElevator.currentLocation == currRequest.callFrom || currElevator.destination == currRequest.callFrom){
        	// 		console.log("found elvator "+ (i+1));
        	// 		return currElevator;
        	// 	}
        	// 	i++;
        	// }
        }


        function anyElevatorOnCurrFloor(currRequest)
        {
        	console.log(currRequest);
        	var i = 0;
        	var found = false;
        	var returnedElevator = null;
        	while(i < allElevators.length && !found){
        		var currElevator = allElevators[i];

        		//check if there is an elevator on this location or one going to this location
        		if(currElevator.currentLocation == currRequest.callFrom || currElevator.destination == currRequest.callFrom){
        			returnedElevator = currElevator;
        			found = true;
        		}
        		i++;
        	}
        	return returnedElevator;
        }

         $("[id*='elevator']").click(function(e) {
        	var buttonId = $(this).attr('id');
        	$(this).children().toggleClass("buttonClicked");
            console.log('button '+ buttonId +' clicked!');
        });

         var requestInArray = function(request, callFrom, direction){
         	var inArray = false;
         	var index = 0;
         	while(!inArray && index < queue.length)
         	{
         		if(queue[index].callFrom === callFrom && queue[index].direction === direction)
         		{
         			inArray = true;
         		}
         		index++;
         	}
         	return inArray;
         };
});