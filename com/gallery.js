
var gallery = function( element_id ) {

  this.element_id = element_id
  this._draw_view()
  
}









///////////////////////////////////////////////////////
// view


// id of the gallery top html element.
// This html element should be a div, and is provided
// by the user of the component.
gallery.prototype.element_id 


// number of thumbnails displayed.
// This number is calculated from the available space.
gallery.prototype.thumbnails_count = 0


// draws the html view
gallery.prototype._draw_view = function() {
  
  this._put_html()
  this._add_nav_click()
  this.add_thumbnail_slots();
    
}



gallery.prototype._put_html = function() {
  
  // alternatively this could be defined
  // with some template system
  var html = ''  
    + '<div class="gllr_nav_box">'
		+	  '<div class="gllr_nav_prev"></div>'
    +   '<div class="gllr_thumbnails_box"></div>'
		+	  '<div class="gllr_nav_next"></div>'
		+ '</div>'
		+ '<div class="gllr_spotlight_image">'
    +   '<img class="gllr_spotlight_img"></img>'
    + '</div>'
  
  $( '#' + this.element_id ).html( html )

}


// add next image button event
gallery.prototype._add_nav_click = function() {
  
  var that = this
  
  $( '#' + this.element_id + ' .gllr_nav_next' ).click(
    function() { that.next.call( that ) }
  )

  $( '#' + this.element_id + ' .gllr_nav_prev' ).click(
    function() { that.prev.call( that ) }
  )
  
}



// Creates the slots for thumbnails images in the view.
// The thumbnails bar shows as many thumbnails as
// can fit in the available space
gallery.prototype.add_thumbnail_slots = function( element_id ) {

  var thumbnail_html = '<div class="gllr_thumbnail"><img id="{id}"></img></div>'

  // determine how many thumbnails to add
  var thumbnails_box = $( '#' + this.element_id + ' .gllr_thumbnails_box' )
  var width = thumbnails_box.width()
  var slots = Math.floor( width / 150 )
	
  // add thumbnails html elements
  for( var i=0; i<slots; i++ ) {
    
    // set the id of the img element and append it
    var id = 'gllr_' + this.element_id + '_thumbnail_'+i
    var with_id = thumbnail_html.replace( '{id}', id )
    thumbnails_box.append( with_id )
    
    // add a special attribute to elements.
    // the thumbnail index, to be used in the click event 
    $( '#' + id ).attr( 'thumbnail_index', i )
    
    var that = this
    // add click event
    $( '#' + id ).click( function() { that._thumbnail_click.call( that, this ) } )
    
    this.thumbnails_count++
  }
	
	
}


gallery.prototype._thumbnail_click = function( elmnt ) {
  
  var click_index = $( elmnt ).attr( 'thumbnail_index' )

  // determine the index of the image in the model
  var image_index = this.thumbnails_offset + (+click_index)
  
  this._spotlight_img_index = image_index
  this._show_spotlight_img()
  this._highlight_thumbnail()
}



gallery.prototype._highlight_color = '#09CFFF'


// highlights the border of the selected thumbnail
gallery.prototype._highlight_thumbnail = function() {
  
  // calculate the thumbnail to highlight
  var index = this._spotlight_img_index - this.thumbnails_offset

  // remove highlight for all thumbnails
  var sel_thumbnails = '#' + this.element_id + ' .gllr_thumbnail' 
  console.log( sel_thumbnails )
  $( sel_thumbnails ).removeClass( 'highlight_thumbnail' )

  // hightlight the selected
  var img_id = '#gllr_' + this.element_id + '_thumbnail_' + index
  $( img_id ).parent().addClass( 'highlight_thumbnail' )
  
}




gallery.prototype._show_spotlight_img = function( image_index ) {
  
  // display the image
  var caption = this._images_data[ this._spotlight_img_index ].value
  var src = this._images_data[ this._spotlight_img_index ].img.src
  
  var selec_spotlight_img = '#' + this.element_id + ' .gllr_spotlight_img'

  $( selec_spotlight_img ).attr( 'src', src )
  
}



// draws images thumbnails based on model data
gallery.prototype._draw_thumbnails = function() {
  
  var thumbnails_to_draw = Math.min( this.thumbnails_count, this._images_data.length )
  
  for( var i=0; i<thumbnails_to_draw; i++) {
        
    var src_thumbnail = this._images_data[i].img.thumbnail
    
    // build the selector for the html id of the image element
    var img_id = '#gllr_' + this.element_id + '_thumbnail_' + i
    $( img_id ).attr( 'src', src_thumbnail )
    
  }
  
}


///////////////////////////////////////////////////////
// control


gallery.prototype.next = function() {
    
  if( this._spotlight_img_index + 1 == this._images_data.length ) return 
  
  this._spotlight_img_index++
  this._show_spotlight_img()
  this._highlight_thumbnail()
}



gallery.prototype.prev = function() {
  
  if( this._spotlight_img_index == 0 ) return
  
  this._spotlight_img_index--
  this._show_spotlight_img()
  this._highlight_thumbnail()
}


///////////////////////////////////////////////////////
// data




// It is a json with data describing the images that 
// will be displayed in the gallery.
// Contains urls, pixel sizes, captions
gallery.prototype._images_data = []



// Index for the currently "spotlight" image.
// It is the currently selected image, displayed
// in large size
gallery.prototype._spotlight_img_index = 0



// Offset for the thumbnails images.
// is the index position in the _images_data Array
// of the first thumbnail image being show
gallery.prototype.thumbnails_offset = 0




// load a json object with data describing the images
// to show in the gallery component
gallery.prototype.add_images_from_json = function( url ) {
  
  var that = this
  
  $.getJSON( 
    url, 
    function( json ) { that._handle_json.call( that, json ) } 
  )

}

// callback function to handle ajax loaded json data
gallery.prototype._handle_json = function( json ) {
  
  //this._images_data = this._images_data.concat( json.data.records )
  this._images_data = this._images_data.concat( json.data.records )
  this._draw_thumbnails()
    
}



