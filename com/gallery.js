
var gallery = function( element_id ) {

  this.element_id = element_id

  this.add_thumbnail_slots();
}









///////////////////////////////////////////////////////
// view


// id of the gallery top html element
// This html element should be a div, an is provided
// by the user of the component.
gallery.prototype.element_id 


// number of thumbnails displayed.
// This number is calculated from the available size.
gallery.prototype.thumbnails_count = 0


// Creates the slots for thumbnails images in the view.
// The thumbnails bar shows as many thumbnails as
// can fit in the available space
gallery.prototype.add_thumbnail_slots = function( element_id ) {

  var thumbnail_html = '<div class="gllr_thumbnail"><img id="{id}"></img></div>'

  // determine how many thumbnails 
  var thumbnails_box = $( '#' + this.element_id + ' .gllr_thumbnails_box' )
  var width = thumbnails_box.width()
  var slots = Math.floor( width / 150 )
	
  // add thumbnails html elements
  for( var i=0; i<slots; i++ ) {
    // set the id of the img element and append it
    var with_id = thumbnail_html.replace( '{id}', 'gllr_thumbnail_'+i )
    thumbnails_box.append( with_id )
    
    this.thumbnails_count++
  }
	
	
}



// draws images thumbnails based on model data
gallery.prototype._draw_thumbnails = function() {
  
  for( var i=0; i<this.thumbnails_count; i++) {
    var src_thumbnail = this._images_data[i].img.thumbnail
    console.log( src_thumbnail )
    $( 'gllr_thumbnail_'+i ).attr( 'src', src_thumbnail )
  }
  
}



///////////////////////////////////////////////////////
// data




// It is a json with data describing the images that 
// will be displayed in the gallery.
// Contains urls, pixel sizes, captions
gallery.prototype._images_data


// Index for the currently "spotlight" image.
// It is the currently selected image, displayed
// in large size
gallery.prototype._spotlight_img_index = 0



// load a json object with data describing the images
// to show in the gallery component
gallery.prototype.get_json = function( url ) {
  
  var that = this
  
  $.getJSON( 
    url, 
    function( json ) { that._handle_json.call( that, json ) } 
  )

}

// callback function to handle ajax loaded json data
gallery.prototype._handle_json = function( json ) {

  this._images_data = json.data.records
  this._draw_thumbnails()
   
}



