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
			this.isTransporting = false;
			this.position = position;
			this.isAcceptingRequests = false;
			this.queue = [];

			this.transport = function(){
				while(this.destination != this.currentLocation)
				{
						$('#bus-floor-'+ this.currentLocation +'-elevator-'+this.position).children().addClass("hidden");
						$('#request-up-'+this.position).children().removeClass('buttonClicked');
					if(this.destination > this.currentLocation)
						this.currentLocation++;
					else
						this.currentLocation--;
					$('#bus-floor-'+ this.currentLocation +'-elevator-'+this.position).children().removeClass("hidden");
						$('#bus-floor-'+ this.currentLocation +'-elevator-'+this.position).children().addClass("selectedElevator");
				}
			}

			//Each elevator has its own individual queue
			this.processQueue = function(){
				var handleRequest = this.queue.shift();
				console.log(handleRequest);
				this.destination = handleRequest.destination;

				if (this.destination != this.currentLocation) { 
					this.transport();
				}
				
				this.isAcceptingRequests = true;
				this.currentLocation = this.destination;
				//on getting to final destination, remove indicator
				$('#elevator-'+ this.position +'-destination-'+this.destination).children().removeClass('buttonClicked');				
				$('#bus-floor-'+ this.currentLocation +'-elevator-'+ this.position).children().addClass("selectedElevator");
				$('#request-'+handleRequest.direction+'-'+handleRequest.destination).children().removeClass('buttonClicked');
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

		//Main Queue for all Elevators
		var QUEUE = [];

		var elevator1 = new Elevator(1);
		var elevator2 = new Elevator(2);
		var elevator3 = new Elevator(3);

		var allElevators = [elevator1, elevator2, elevator3];

        $("[id*='request']").click(function(e) {
        	var buttonId = $(this).attr('id');
        	$(this).children().addClass("buttonClicked");
        	var data = buttonId.split("-");

        	if (!requestInMainQueue(data[2],data[1])) {
	        	var request = new MainQueueRequest(data[2],data[1]);
	            QUEUE.push(request);
	            dispatchElevator();
        	};
        });

        var dispatchElevator = function(){
        	var dispatchedElevator = getAppropriateElevator();
        	dispatchedElevator.processQueue();
        };

        function getAppropriateElevator(){
        	var currRequest = QUEUE.shift();
        	var elevatorToDispatch = null;
        	elevatorToDispatch = anyElevatorOnCurrFloor(currRequest);
        	if(elevatorToDispatch === null)
        	{
        		elevatorToDispatch = findClosestElevator(currRequest);
        	}
        	elevatorToDispatch.queue.push(currRequest);
        	return elevatorToDispatch;
        }

        //if there is an elevator on the floor of the request, use that elevator
        function anyElevatorOnCurrFloor(currRequest)
        {
        	var i = 0;
        	var found = false;
        	var returnedElevator = null;
        	while(i < allElevators.length && !found){
        		var currElevator = allElevators[i];

        		//check if there is an elevator on this location
        		if(currElevator.currentLocation === currRequest.destination){
        			returnedElevator = currElevator;
        			found = true;
        		}
        		i++;
        	}
        	return returnedElevator;
        }

        function findClosestElevator(currRequest){
        	console.log(currRequest);
    		var returnedElevator = allElevators[0];
        	for(var i = 1 ; i < allElevators.length; i++)
        	{
        		if((currRequest.destination - allElevators[i].currentLocation) > (currRequest.destination - returnedElevator.currentLocation))
        		{
        			returnedElevator = allElevators[i];
        		}
        	}
        	console.log(returnedElevator);
        	return returnedElevator;
        }

         $("[id*='elevator']").click(function(e) {
        	var buttonId = $(this).attr('id');
        	var data = buttonId.split("-");
        	if (allElevators[data[1]-1].isAcceptingRequests) {
        		if (!requestInElevatorQueue(data[1]-1,data[3])) {
		        	var request = new ElevatorQueRequest(data[1],data[3]);
	        		$(this).children().addClass("buttonClicked");
		            allElevators[data[1]-1].queue.push(request);
		            setTimeout(function(){
						    allElevators[data[1]-1].processQueue();
					}, 1000);
        		};
        	};
        	
        });

         var requestInMainQueue = function(callFrom, direction){
         	var inArray = false;
         	var index = 0;
         	while(!inArray && index < QUEUE.length)
         	{
         		if(QUEUE[index].destination === callFrom && QUEUE[index].direction === direction)
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
         	return found;
         };
});