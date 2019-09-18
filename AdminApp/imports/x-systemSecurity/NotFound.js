import React from 'react';
import {Link} from 'react-router';

export default class NotFound extends React.Component{
  componentWillMount() {
    var commonCss = document.createElement("link");
    commonCss.type="text/css";
    commonCss.rel ="stylesheet";
    commonCss.href="/css/common.css";
    document.head.append(commonCss);
  }
  componentWillUnmount() {
    $("link[href='/css/common.css']").remove();
  }
  render(){
    return(
      <div>Sorry! the page you are looking for is not found.</div>
    );
  }
}
