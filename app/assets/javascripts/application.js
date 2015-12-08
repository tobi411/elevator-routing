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
			this.position = position;
			this.isAcceptingRequests = false;
			this.queue = [];
			this.move = function(destination){
				console.log("moving from "+ this.currentLocation +" to "+ destination);
				// this.destination = destination;
				// this.currentLocation = destination; //REMOVE THIS!!!!
				this.destination = destination;
				while(this.currentLocation != this.destination)
				{
					if(this.destination > this.currentLocation)
					{
						$('#bus-floor-'+ this.currentLocation +'-elevator-'+this.position).children()
						.fadeIn('slow',function(){
							$(this).addClass("hidden");
						});
						this.currentLocation++;
						$('#bus-floor-'+ this.currentLocation +'-elevator-'+this.position).children().removeClass("hidden");
						// $('#bus-floor-'+ this.currentLocation +'-elevator-'+this.position).children().addClass("show selectedElevator");
					}else{
						this.currentLocation--;
					}
				}
				this.isAcceptingRequests = true;
				this.currentLocation = this.destination;
				$('#bus-floor-'+ this.currentLocation +'-elevator-'+ this.position).children().addClass("selectedElevator");
				console.log(this.currentLocation + " is set");
			};
			this.processQueue = function(){
				var handleRequest = this.queue.shift();
				this.move(handleRequest.destination);
				console.log("processing "+ this.position);
				if(this.queue.length > 0)
					this.processQueue();
			};
		}

		function MainQueueRequest(callFrom,direction)
		{
			this.destination = callFrom;
			this.direction = direction;
		}

		function ElevatorQueRequest(callFrom, destination){
			this.callFrom = callFrom;
			this.destination = destination;
		}



		//a queue of requests
		var queue = [];

		var elevator1 = new Elevator(1);
		var elevator2 = new Elevator(2);
		var elevator3 = new Elevator(3);

		// elevator1.move(1);
		// elevator2.move(2);
		// elevator3.move(3);

		var allElevators = [elevator1, elevator2, elevator3];

        $("[id*='request']").click(function(e) {
        	var buttonId = $(this).attr('id');
        	$(this).children().addClass("buttonClicked");
        	var data = buttonId.split("-");

        	if (!requestInMainQueue(data[2],data[1])) {
	        	var request = new MainQueueRequest(data[2],data[1]);
	            console.log('button '+ buttonId +' clicked!');
	            queue.push(request);
	            console.log(queue);
	            dispatchElevator();
	            console.log(queue);
        	};
        });

        var dispatchElevator = function(){
        	console.log("here");
        	var dispatchedElevator = getAppropriateElevator();
        	console.log(dispatchedElevator);
        	dispatchedElevator.processQueue();
        };

        function getAppropriateElevator(){
        	var currRequest = queue.shift();
        	var elevatorToDispatch = null;
        	elevatorToDispatch = anyElevatorOnCurrFloor(currRequest);
        	if(elevatorToDispatch !== null)
        	{
        		// allElevators[elevatorToDispatch.position - 1].queue.push(currRequest);
        		elevatorToDispatch.queue.push(currRequest);
        	}else{
        		// elevatorToDispatch.
        		console.log("nothing")
        	}
        	return elevatorToDispatch;
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
        		if(currElevator.currentLocation == currRequest.destination){
        			returnedElevator = currElevator;
        			found = true;
        		}
        		i++;
        	}
        	return returnedElevator;
        }

         $("[id*='elevator']").click(function(e) {
        	var buttonId = $(this).attr('id');
        	var data = buttonId.split("-");
        	if (allElevators[data[1]-1].isAcceptingRequests) {
        		if (!requestInElevatorQueue(data[1]-1,data[3])) {
		        	var request = new ElevatorQueRequest(data[1],data[3]);
	        		$(this).children().addClass("buttonClicked");
		            console.log('button '+ buttonId +' clicked!');
		            allElevators[data[1]-1].queue.push(request);
		            console.log(allElevators[data[1]-1].queue);
		   //          // dispatchElevator();
		   //          console.log(queue);
		            setTimeout(function(){
						    allElevators[data[1]-1].processQueue();
					}, 2500);
        		};
        	};
        	
        });

         var requestInMainQueue = function(callFrom, direction){
         	var inArray = false;
         	var index = 0;
         	while(!inArray && index < queue.length)
         	{
         		if(queue[index].destination === callFrom && queue[index].direction === direction)
         		{
         			inArray = true;
         		}
         		index++;
         	}
         	return inArray;
         };

         var requestInElevatorQueue = function(elevatorNumber, destination){
         	var currElevator = allElevators[elevatorNumber];
         	var i = 0;
         	var found = false;
         	while(i < currElevator.queue.length && !found){
         		if(currElevator.queue[i].destination == destination){
         			found = true
         		}
         		i++;
         	}
         	console.log(found);
         	return found;
         };
});