
var gallery = function( element_id ) {

  this.element_id = element_id

  this.add_thumbnail_slots();
}



gallery.prototype.element_id 






///////////////////////////////////////////////////////
// view


// id of the gallery top html element 
gallery.prototype.element_id 


// number of thumbnails displayed.
// used for pagination.
gallery.prototype.thumbnails_count = 0



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
    console.log( 'count: ' + this.thumbnails_count )
  }
	
	
}



///////////////////////////////////////////////////////
// data


// var to store the json data.
// The json data describes the images that 
// will be displayed in the gallery.
// Contains names, urls, sizes
gallery.prototype._json



gallery.prototype.get_json = function( url ) {

  $.getJSON( url, this._handle_json )

}



// callback function to handle ajax loaded json data
// sets url for image thumbnails
gallery.prototype._handle_json = function( data ) {


  this._json = data
  console.dir( this._json )
  
  console.log( 'count: ' + this.thumbnails_count )
  
  for( var i=0; i<this.thumbnails_count; i++) {
    var src = this._json.data.records[i].img
    console.log(src)
    $( 'gllr_thumbnail_'+i ).attribute( 'src', src )
  }
  

  
}


