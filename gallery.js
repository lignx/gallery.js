////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// 
// gallery class
//
////////////////////////////////////////////////////////////////
//
//
// Javascript class to display a gallery of images in html.
//
//
// Features:
//
// - Loads the image data in json format with ajax.
// - Display selectable image thumbnails. 
// - Provides next and prev functionality. 
// - Highlights currently selected thumbnail. 
// - Support simple "pagination" of thumbnails. 
// - Style with css. 
// - Show multiple gallery instances on the same page.
// - Add multiple sets of images to the same gallery
//
//
//
///////////////////////////////////////////////////////////////
//
// Usage:
//
//
// Create an instance on an existing html <div> with:
//
//    gall_instance_1 = new gallery( 'id_of_an_existing_html_element' )
//
//
// Add images from json data:
//
//    gall_instance_1.add_images_from_json( 'data/feed.json' )
//
// That's all. The gallery component should be showing the images.
//
// More images can be added to the gallery:
//
//    gall_instance_1.add_images_from_json( 'data/other_feed.json' )
//
//
//
/////////////////////////////////////////////////////////////////
//
// Docs
//
/////////////
//
// gallery( element_id )
// 
//    constructor.
//    Creates a new gallery instance, associated to a 
//    porovided html element.
//
//    - element_id
//    string, the id of an existing html
//    <div> inside of which the gallery will be placed.
//
//    Example:
//        gall = new gallery( box_div_3 )
//
/////////////
//
// .add_images_from_json( json_url )
// 
//    method.
//    Loads data for images with ajax.
//    The thumbnails are inmediatelly show in the html,
//    and the first one is show in the large area.
//
//
//    - json_url
//    string, an url pointing to a json object with the 
//    correct format.
//
//    Example:
//        gall.add_images_from_json( 'data/feed.json' )
//
//
//
/////////////////////////////////////////////////////////////////
//
// json data format
//
//
// The json object should take this form:
//
// Some fields are marked "not used", but maybe used 
// in a future version.
//
// {
//    "data": {
//        "records": [
//            {
//                "img": {
//                    "src": "http://abc.com/image1.jpg",
// (not used: )       "width": 507,
// (not used: )       "height": 378,
//                    "thumbnail": "http://abc.com/image2.jpg",
// (not used: )       "thumbnail_hq": "http://abc.com/image3.jpg",
//                },
//                "value": "Driving down Highway 1"
//            },
//            ...etc
//
//
//
/////////////////////////////////////////////////////////////////




// Constructor.
// creates a gallery instance, on top of an
// existing html element.
var gallery = function( element_id ) {

  this.element_id = element_id
  this._draw_view()
  
}




///////////////////////////////////////////////////////
//
// data



// It is a json with data describing the images that 
// will be displayed in the gallery.
// Contains urls, pixel sizes, captions
gallery.prototype._images_data = []



// Index for the currently "spotlight" image.
// It is the currently selected image, displayed
// in large size
gallery.prototype._spotlight_img_index = 0



// number of thumbnails displayed.
// This number is calculated from the available space.
gallery.prototype.thumbnails_count = 0


// Offset for the thumbnails images.
// is the index position in the _images_data Array
// of the first thumbnail image being show
gallery.prototype.thumbnails_offset = 0


// id of the gallery top html element.
// This html element should be a div, and is provided
// by the user of the component.
gallery.prototype.element_id 




// load a json object with data describing the images
// to show in the gallery component.
// This method can be called multiple times
// to add more images
gallery.prototype.add_images_from_json = function( url ) {
  
  var that = this
  
  $.getJSON( 
    url, 
    function( json ) { that._handle_json.call( that, json ) } 
  )

}


// callback function to handle ajax loaded json data.
// Draw the newly added image thumbnails, and the spotlight image.
gallery.prototype._handle_json = function( json ) {
  
  this._images_data = this._images_data.concat( json.data.records )
  this._draw_thumbnails()
  this._show_spotlight_img()
  this._highlight_thumbnail()
}






///////////////////////////////////////////////////////
// view





// draws the html view of the gallery.
// This method is called at the start.
// Also, it could be called if the browser window is resized.
// If resizing the view should be supported.
gallery.prototype._draw_view = function() {
  
  this._put_html()
  this._add_nav_click()
  this.add_thumbnail_slots();
    
}



gallery.prototype._put_html = function() {
  
  // alternatively, this could be defined
  // with some javascript templating system
  var html = ''  
    + '<div class="gllr_nav_box">'
		+	  '<div class="gllr_nav_prev"><div class="left_css_shape"></div></div>'
    +   '<div class="gllr_thumbnails_box"></div>'
		+	  '<div class="gllr_nav_next"><div class="right_css_shape"></div></div>'
		+ '</div>'
		+ '<div class="gllr_spotlight_image">'
    +   '<img class="gllr_spotlight_img"></img>'
    + '</div>'
    + '<div class="gllr_caption_box"></div>'
  
  $( '#' + this.element_id ).html( html )

}


// add next and prev image button events
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

  var thumbnail_html = ''
  + '<div class="gllr_thumbnail">'
  + '<img id="{id}" class="gllr_thumbnail_img"></img>'
  + '</div>'

  // determine how many thumbnails to add
  var thumbnails_box = $( '#' + this.element_id + ' .gllr_thumbnails_box' )
  var width = thumbnails_box.width()
  var slots = Math.floor( width / 120 )
	
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







// highlights the border of the selected thumbnail
gallery.prototype._highlight_thumbnail = function() {
  
  // calculate the thumbnail to highlight
  var index = this._spotlight_img_index - this.thumbnails_offset

  // remove highlight for all thumbnails
  var sel_thumbnails = '#' + this.element_id + ' .gllr_thumbnail' 

  $( sel_thumbnails ).removeClass( 'highlight_thumbnail' )

  // hightlight the selected
  var img_id = '#gllr_' + this.element_id + '_thumbnail_' + index
  $( img_id ).parent().addClass( 'highlight_thumbnail' )
  
}



// display the currently selected image in the
// large central area. Also show the caption
// for the image.
gallery.prototype._show_spotlight_img = function( image_index ) {
  
  // get the data
  var caption = this._images_data[ this._spotlight_img_index ].value
  var src = this._images_data[ this._spotlight_img_index ].img.src
  
  // set the image src
  var selec_spotlight_img = '#' + this.element_id + ' .gllr_spotlight_img'
  $( selec_spotlight_img ).attr( 'src', src )

  // set the caption text
  var selec_caption = '#' + this.element_id + ' .gllr_caption_box'
  $( selec_caption ).text( caption )
 
}



// draws images thumbnails based on loaded model data
gallery.prototype._draw_thumbnails = function() {
  
  // clear all thumbnails
  var sel_thumbnails_imgs = '#' + this.element_id + ' .gllr_thumbnail_img'
  $( sel_thumbnails_imgs ).css( 'display', 'none' )
  
  // how many thumbnails need images:
  var thumbnails_to_draw = Math.min( 
    this.thumbnails_count, 
    this._images_data.length - this.thumbnails_offset 
  )
  
  // set the images src
  for( var i=0; i<thumbnails_to_draw; i++) {
        
    var src_thumbnail = this._images_data[ this.thumbnails_offset+i].img.thumbnail
    
    // build the selector for the html id of the image element
    var img_id = '#gllr_' + this.element_id + '_thumbnail_' + i
    $( img_id ).attr( 'src', src_thumbnail )
    $( img_id ).css( 'display', 'inline' )
    
  }
  
}





///////////////////////////////////////////////////////
// control



// jump to the next image, if there are any
gallery.prototype.next = function() {
    
  if( this._spotlight_img_index + 1 == this._images_data.length ) return 
  
  this._spotlight_img_index++
  this._show_spotlight_img()
  
  // pagination:
  // if the thumbnail is outside the visible ones
  // increase the offset and redraw the thumbnails
  
  var index = this._spotlight_img_index - this.thumbnails_offset
  
  if( index + 1 > this.thumbnails_count ) {
    this.thumbnails_offset += this.thumbnails_count
    this._draw_thumbnails()
  }
  
  
  // highlight current thumbnail
  this._highlight_thumbnail()
  
}



// jump to the previous image, if there are any
gallery.prototype.prev = function() {
  
  if( this._spotlight_img_index == 0 ) return
  
  this._spotlight_img_index--
  this._show_spotlight_img()
  
  // pagination:
  // if the thumbnail is outside the visible ones
  // decrease the offset and redraw the thumbnails
  
  var index = this._spotlight_img_index - this.thumbnails_offset
  
  if( index < 0 ) {
    this.thumbnails_offset -= this.thumbnails_count
    if( this.thumbnails_offset < 0 ) this.thumbnails_offset = 0
    this._draw_thumbnails()
  } 
  
  
  // highlight current thumbnail
  this._highlight_thumbnail()
}



// Controls when a thumbnail is clicked.
gallery.prototype._thumbnail_click = function( elmnt ) {
  
  // get the index of the clicked thumbnail
  var click_index = $( elmnt ).attr( 'thumbnail_index' )

  // determine the index of the image in the model
  var image_index = this.thumbnails_offset + (+click_index)
  
  this._spotlight_img_index = image_index
  this._show_spotlight_img()
  this._highlight_thumbnail()
  
}
