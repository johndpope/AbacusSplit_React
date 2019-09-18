import React, { Component } from 'react';
import { Session } from 'meteor/session';
import GoogleMap from './lib/GoogleMap.js';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// import { fitBounds } from 'google-map-react/utils';


if (Meteor.isClient) {
    Meteor.startup(function() {
        GoogleMaps.load({ v: '3', key: 'AIzaSyAMQgBApJ12glGXoqCwoNNSnxGtkgeUkDI', libraries: 'geometry,places' });
    });
}

export default class ContactUsMap extends Component {
    constructor() {
        super();
        this.handleOnReady = this.handleOnReady.bind(this);
    }

    handleMapOptions() {
        return {
            center          : new google.maps.LatLng(24.774265,46.738586),
            zoom            : 15,
            mapTypeId       : google.maps.MapTypeId.ROADMAP,
        };
    }

    handleOnReady(name) {
        var marker;
        var radius_circle;


        GoogleMaps.ready(name, map => {
            Tracker.autorun(c => {

             //    var formvalues = {
             //        addrLine     : Session.get("getUserAddress"),
             //        state        : Session.get("getUserState"),
             //        city         : Session.get("getUserCity"),
             //        area         : Session.get("getUserArea"),
             //        zip          : Session.get("getUserPincode"),
        	    // }

                // Remove old Markers from map
                if (marker) {
                  marker.setMap(null);
                  marker = null;
                }

                // var address = formvalues.addrLine+', '+formvalues.state+', '+formvalues.city+', '+formvalues.area+', '+formvalues.zip;

                // Get lat long from address
        		// var geocoder = new google.maps.Geocoder();
		        // geocoder.geocode( { 'address': address}, function(results, status) {
          //           if (status == google.maps.GeocoderStatus.OK) {
    		    //         var latitude  = results[0].geometry.location.lat();
    		    //         var longitude = results[0].geometry.location.lng();
          //               Session.set("addrLat",latitude);
          //               Session.set("addrLng",longitude);
    		    //     }
          //       });


                var Lat = Session.get("addrLat");
                var Lng = Session.get("addrLng");
                // if(!Lat&&!Lng){
                    Lat = 24.774265;
                    Lng = 46.738586;
                // }
                // Add New Marker
                var loc = new google.maps.LatLng(Lat, Lng);
                marker = new google.maps.Marker({
                    draggable             : false,
                    position              : loc,
                    map                   : map.instance,
                    animation             : google.maps.Animation.BOUNCE,
                    mapTypeId             : google.maps.MapTypeId.ROADMAP,
                });

                // Set map Marker in center
                var address_lat_lng = {};

                if(Session.get("addrLng")){
                  address_lat_lng = {lat: Lat, lng: Lng};

                }else{
                  var Lat      = 24.774265;
                  var Lng      = 46.738586;
                  address_lat_lng = {lat:Lat , lng:Lng };
                }

                // var radius = (0.1 * 1609.344);
                // radius_circle = new google.maps.Circle({
                //   center         : address_lat_lng,
                //   radius         : radius,
                //   clickable      : false,
                //   map            : map.instance,
                //   strokeColor    : '#FFF',
                //   strokeWeight   : 0 ,        // DON'T SHOW CIRCLE BORDER.
                //   strokeOpacity  : 0.8,
                //   strokeWeight   : 2,
                //   fillColor      : '#54Aff3',
                //   fillOpacity    : 0.25,
                // });

                // radius_circle.bindTo('center', marker, 'position');
                // if (radius_circle) {
                //     map.instance.fitBounds(radius_circle.getBounds());
                // }
                


                 map.instance.setCenter(marker.getPosition());
                    // map.fitBounds(map.instance.bounds);
                this.computation = c;
            });
        });
    }

    componentWillUnmount() {
        if(this.computation){
          this.computation.stop();
        }
    }

    render() {
        return (
            <GoogleMap onReady={this.handleOnReady} mapOptions={this.handleMapOptions}>
                <div id="map" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Loading!</div>
            </GoogleMap>
        );
    }
}
