require('normalize.css/normalize.css');
//webpack-dev-server默认是以src为根路径
require('styles/App.scss');

import React from 'react';

// 获取自定义数据
let imageDatas = require('sources/imageDatas.json');
// console.log(imageDatas);

// 获取自定义图片地址
  // imageDatas = (function (imageDatasArr){
    for(var i = 0;i < imageDatas.length;i++){
      // let singleImageData = imageDatasArr[i];
    	imageDatas[i].imageURL = require('../images/'+imageDatas[i].fileName);
      // imageDatasArr[i] = singleImageData;
    }
   // return imageDatasArr;
  // })(imageDatas);

var a=[{a:1},{a:2}];


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <div className="img-sec">{imageDatas[4].imageURL}</div>
    		<nav className="controller-nav">{a[1].a}</nav>
        <img src={imageDatas[1].imageURL} />
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
