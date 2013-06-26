// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'qSwitch',
        defaults = {
            classMain: 'qSwitchMain',
       		classHandle: 'qSwitchHandle',
       		classContainer: 'qSwitchContainer',
       		classLower: 'qSwitchLower',
       		classOptionA: 'qSwitchOptionA',
       		classOptionB: 'qSwitchOptionB',
       		textOptionA: null,
       		textOptionB: null,
       		classOptionAText: 'qSwitchTextOptionA',
       		classOptionBText: 'qSwitchTextOptionB',
       		classOptionAIcon: 'qSwitchIconOptionA',
       		classOptionBIcon: 'qSwitchIconOptionB',
       		moveThreshhold: 10,
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );
        var self = this;
		
		//Declare selectors
		
		self.$main = null;
		self.$container = null;
		self.$handle = null;
		self.$lower = null;
		self.$optionA = null;
		self.$optionB = null;
		self.$optionAText = null;
		self.$optionBText = null;
		self.$optionAIcon = null;
		self.$optionBIcon = null;
		self.$radioA = null;
		self.$radioB = null;

		self.qWidth = null;
		self.qHeight = null;
		self.startPoint = null;
		self.endPoint = null;
		
        self._defaults = defaults;
        self._name = pluginName;

        self.init(self);
    }

    Plugin.prototype = {

        init: function(self) {
        
        	
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            
            // Grab, store, & hide the radio buttons in the qSwitch div.  So long as we haven't overidden the option labels, we'll use the Radio values.
            
            self.$radioA = $(self.element).find('input:first-child');
            self.$radioB = $(self.element).find('input:nth-child(2)');
            
            self.$radioA.hide();
            self.$radioB.hide();
            
            if(!self.options.textOptionA){
            	self.options.textOptionA = self.$radioA.val();
            }
            
            if(!self.options.textOptionB){
            	self.options.textOptionB = self.$radioB.val();
            }
            
            //Inititalize selectors & construct the DOM
             
			self.$main = $('<div class="' + this.options.classMain + '"></div>');
  			self.$handle = $('<div class="' + this.options.classHandle + '"></div>');
  			self.$container = $('<div class="' + this.options.classContainer + '"></div>');
  			self.$lower = $('<div class="' + this.options.classLower + '"></div>');
  			self.$optionA = $('<div class="' + this.options.classOptionA + '"></div>');
  			self.$optionB = $('<div class="' + this.options.classOptionB + '"></div>');
  			self.$optionAText = $('<div class="' + this.options.classOptionAText + '">' + this.options.textOptionA + '</div>');
  			self.$optionBText = $('<div class="' + this.options.classOptionBText + '">' + this.options.textOptionB + '</div>');
  			self.$optionAIcon = $('<div class="' + this.options.classOptionAIcon + '"><span></span></div>');
  			self.$optionBIcon = $('<div class="' + this.options.classOptionBIcon + '"><span></span></div>');
  			
  			self.$handle.appendTo(self.$lower);
  			self.$optionAText.appendTo(self.$optionA);
  			self.$optionAIcon.appendTo(self.$optionA);
  			self.$optionBText.appendTo(self.$optionB);
  			self.$optionBIcon.appendTo(self.$optionB);
			self.$optionA.appendTo(self.$lower);
			self.$optionB.appendTo(self.$lower);
			self.$lower.appendTo(self.$main);
			self.$container.appendTo(self.$main);			
 			self.$main.appendTo(self.element);
 			
 			
 			// size + position elements
 			
 			self.qWidth = parseInt(self.$main.css('width'), 10);
 			self.qHeight = parseInt(self.$main.css('height'), 10);
 			//$('#debugger').append('Container Width: ' + self.qWidth + '<br>');
 				


 			self.$container.width((self.qWidth * 3) - self.qHeight + 'px');
 			self.$container.css('left', (self.qWidth * -1) + (self.qHeight / 2)  + 'px');
 			//self.$handle.width(self.qHeight + 'px');
 			//self.$handle.height(self.qHeight + 'px');
 			
 			//$('#debugger').append('Offset Left: ' + (self.qWidth * -.5) + '<br>');
 			
 			self.$handle.css('left', (self.qWidth - (self.qHeight * .5)) + 'px');
 			
 					//Style elements
 					
 					self.$main.css({
 						'overflow' : 'hidden',
 						'z-index' : '20'
 					});
 					
 					self.$lower.css({
 						'width' : self.qWidth * 2 + 'px',
 						'left': (self.qWidth * -.5)  + 'px',
 						'z-index' : '1',
 						'position' : 'relative',
 						'height' : '100%'
 						});
 						
 					self.$handle.css({
 						'width' : self.qHeight - (2* parseInt(self.$handle.css('border-width'), 10)) + 'px',
 						'height' : self.qHeight - (2 * parseInt(self.$handle.css('border-width'), 10)) + 'px',
 					});
 						
 					self.$container.css({
 						'height' : '100%',
 						'position' : 'absolute',
 					});
 					
 					self.$handle.css({
 						'position' : 'absolute',
 					});
 						
 					self.$optionA.css({
 						'width': self.qWidth  - (self.qHeight * .75) + 'px',
 						'padding-left': (self.qHeight * .75) + 'px',
 						'height' : '100%',
 						'float' : 'left'
 					});
 					
 					self.$optionB.css({
 						'width': self.qWidth - (self.qHeight * .75)  + 'px',
 						'padding-right': (self.qHeight * .75) + 'px',
 						'height' : '100%',
 						'float' : 'right'
 					});
 					
 					self.$optionAText.css({
 						'position' :  'relative', 
 						'height': '100%',
 						'margin' : '0',
 						'float' : 'left',
 						'width' : (self.qWidth - self.qHeight)/2 + 'px'
 					});
 					
 					self.$optionAIcon.css({
 						'position' :  'relative', 
 						'height': '100%',
 						'margin' : '0',
 						'float' : 'left',
 						'width' : (self.qWidth - (self.qHeight * 1.5))/2 + 'px'
 					});
 					
 					self.$optionBText.css({
 						'position' :  'relative', 
 						'height': '100%',
 						'margin' : '0',
 						'float' : 'right',
 						'width' : (self.qWidth - self.qHeight)/2 + 'px'
 					});
 					
 					self.$optionBIcon.css({
 						'position' :  'relative', 
 						'height': '100%',
 						'margin' : '0',
 						'float' : 'right',
 						'width' : (self.qWidth - (self.qHeight * 1.5))/2 + 'px'
 					});
 					
 			
 			self.$lower.draggable( {
 				axis: 'x',
 				//handle: self.$handle,
 				containment: self.$container,
 				start: function (event, ui) {
 						self.startPoint = parseInt(ui.position.left, 10);
 						//$('#debugger').append('Start Left: ' + self.startPoint + '<br>');
 					},
 				stop: function(event, ui) {
 						self.endPoint = parseInt(ui.position.left, 10);
 						//$('#debugger').append('Position Left: ' + self.endPoint + '<br>');
 						var movedAmount =  self.endPoint - self.startPoint;	
 						//$('#debugger').append('Moved: ' + movedAmount + '<br>');
 						if (movedAmount > self.options.moveThreshhold){
 							self.$radioA.prop('checked', true);
 							self.$lower.animate({
 								left: -1 * (self.qHeight/2) + 'px'},
 								120
 							);
  						}
 						else if(movedAmount < -1 * self.options.moveThreshhold){
 							self.$radioB.prop('checked', true);
 							self.$lower.animate({
 								left: -1 * (self.qWidth - (self.qHeight/2)) + 'px'},
 								120
 							);
 						}
 						else {
 							self.$lower.animate({
 								left: self.startPoint + 'px'},
 								40
 							);
 						};
 						
 					}
 				});
 				
 				self.$optionA.click(function(){
 					self.$radioA.prop('checked', true);
 					self.$lower.animate({
 						left: -1 * (self.qHeight/2) + 'px'},
 						60
 					);
 				});
 				
 				self.$optionB.click(function(){
 					self.$radioB.prop('checked', true);
 					self.$lower.animate({
 						left: -1 * (self.qWidth - (self.qHeight/2)) + 'px'},
 						60
 					);
 				});
 				
 			
 			},


        yourOtherFunction: function(el, options) {
            // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );



$(document).ready(function(){
	$(".qSwitch").qSwitch();
	 $(".qSwitch2").qSwitch({classMain: 'qSwitchMain2'});
});