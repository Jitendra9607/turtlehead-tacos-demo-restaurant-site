import * as React from "react";

import { Link } from "@yext/pages/components";
import Address from "./Address";

export default function Nearby(props: any) {
  //console.log(props.externalApiData.response.results);
  const [neardata, setNeardata] = React.useState(props.externalApiData.response.results);
  console.log(neardata,"Neardata");
  
    return (
      <>
        {neardata.map((nearbylocations:any, index: Number) => {
          if(index>0){
            
            return(
              <>
              {/* <SplideSlide key={index}> */}
                <div className="nearby-card">
                  <div className="location-name-miles icon-row">
                    <h2><Link className="inline-block notHighlight" href={`/${nearbylocations.data.id}`}
                      data-ya-track={`${nearbylocations.data.name}`}
                      eventName={`${nearbylocations.data.name}`}
                      rel="noopener noreferrer">{nearbylocations.data.name}</Link></h2>

                  </div>
                 
                  <div className="icon-row content-col">
                    <Address address={nearbylocations.data.address} />
                  </div>
                  <div className="icon-row closeing-div">
                  {nearbylocations.data.hours?
                  <div className="flex open-now-string items-center " data-id={`main-shop-${nearbylocations.data.id}`} >
                    {/* <OpenClose timezone={nearbylocations.data.timezone} hours={nearbylocations.data.hours} deliveryHours={nearbylocations.data.hours}></OpenClose> */}
                  </div>:
                  <div className="closeddot notHighlight red-dot">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
                    <circle id="Ellipse_5" data-name="Ellipse 5" cx="4" cy="4" r="4" fill="#ad1e1f"/>
                  </svg>
                  <div className="hours-info text-lg font-second-main-font closeddot"> 
                  Closed
                  </div>
                  </div>
                  }
                  </div> 
                  <div className="button-bx">
                    <Link className="btn" href={`/${nearbylocations.data.id}`}
                     data-ya-track={`viewstore-${nearbylocations.data.name}`}
                     eventName={`viewstore-${nearbylocations.data.name}`}
                     rel="noopener noreferrer">
                      {/* <div dangerouslySetInnerHTML={{__html: View_Store}}/> */}
                      STORE DETAILS</Link>
                    {/* <GetDirection buttonText={props.c_getDirectionsCTAText?props.c_getDirectionsCTAText:"Get directions"} address={location.data.address} latitude={location.data.displayCoordinate ? location.data.displayCoordinate.latitude : location.data.yextDisplayCoordinate.latitude} longitude={location.data.displayCoordinate ? location.data.displayCoordinate.longitude : location.data.yextDisplayCoordinate.longitude} /> */}
                  </div>
                </div>
              {/* </SplideSlide> */}
            </>
            )
          }
        }  
      )}
      </>
    )}
