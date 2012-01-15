
# gallery

A simple javascript image gallery component.
MIT license.

## Features

* Loads the image data in json format with ajax.
* Display selectable image thumbnails. 
* Provides next and prev functionality. 
* Highlights currently selected thumbnail. 
* Support simple "pagination" of thumbnails. 
* Style with css. 
* Show multiple gallery instances on the same page.
* Add multiple sets of images to the same gallery

## Usage

Create an instance on an existing html <div> with:

    gall_1 = new gallery( 'id_of_an_existing_html_element' )

Add images from json data:

    gall_1.add_images_from_json( 'data/feed.json' )

That's all. The gallery component should be showing the images.
More images can be added to the gallery:

    gall_1.add_images_from_json( 'data/other_feed.json' )


## Docs


 gallery( element_id )
 
    constructor.
    Creates a new gallery instance, associated to a 
    porovided html element.

    * element_id
    string, the id of an existing html
    div inside of which the gallery will be placed.

    Example:
        gall = new gallery( box_div_3 )



 .add_images_from_json( json_url )
 
    method.
    Loads data for images with ajax.
    The thumbnails are inmediatelly show in the html,
    and the first one is show in the large area.


    * json_url
    string, an url pointing to a json object with the 
    correct format.

    Example:
        gall.add_images_from_json( 'data/feed.json' )





## json data format


 The json object should take this form:

 Some fields are marked "not used", but maybe used 
 in a future version.

     {
         "data": {
             "records": [
                 {
                     "img": {
                         "src": "http:abc.com/image1.jpg",
      (not used: )       "width": 507,
      (not used: )       "height": 378,
                         "thumbnail": "http:abc.com/image2.jpg",
      (not used: )       "thumbnail_hq": "http:abc.com/image3.jpg",
                     },
                     "value": "Driving down Highway 1"
                 },
                 ...etc
     




