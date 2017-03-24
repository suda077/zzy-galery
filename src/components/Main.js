require('normalize.css/normalize.css');
//webpack-dev-server默认是以src为根路径
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取自定义数据
let imageDatas = require('sources/imageDatas.json');

// 获取自定义图片地址
for(var i = 0;i < imageDatas.length;i++){
	imageDatas[i].imageURL = require('../images/'+imageDatas[i].fileName);
}

//获取区间内的一个随机值
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

// 获取一个随机的角度(-30~30度)
var getDegRandom = () => Math.ceil(Math.random() * 60 - 30);


// 定义每个图片标签
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  //点击事件
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    var styleObj = {};

    //指定图片位置
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    // 指定图片角度
    if(this.props.arrange.rotate){
      ['Moz','Ms','Webkit',''].forEach((item) => {
        styleObj[item + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      });
    }

    // 指定居中图片优先级
    if(this.props.arrange.isCenter){
      styleObj['zIndex'] = 11;
    }

    //按isInverse判断是否添加class
    let isInverseClassName = this.props.arrange.isInverse ? ' is-inverse ' : '';
    
    return (
      <figure className={'img-figure' + isInverseClassName} style={styleObj} onClick={this.handleClick} >
        <img src={this.props.data.imageURL}  alt={this.props.data.title} width='240' height='240' />
        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
        </figcaption>
        <div className="img-back" >
          <p>
            {this.props.data.desc}
          </p>
        </div>
      </figure>
    );
  }
}


class AppComponent extends React.Component {
  // 构造器
  constructor(props){
    // 需要在构造器中使用this.props时需要把props作为参数传入super函数，而super函数代表对整个类的引用
    super(props);
    // 初始化图片范围
    this.Constant = {
      // 中心图片位置
      centerPos:{
        left:0,
        right:0
      },
      // 水平方向取值范围
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      // 垂直方向取值范围
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    };

    // 图片/按钮状态
    this.state = {
      imgsArrangeArr: []
    };
  }

  //图片翻转
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  //按照rearrange图片居中
  center(index){
    return () => {
      this.rearrange(index);
    }
  }


  //随机布局所有图片
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,

        imgsArrangeTopArr = [],//上侧区域状态信息
        topImgNum = Math.floor(Math.random()*2),//0-1个
        topImgSpliceIndex = 0,//获取上侧图片索引

        //得到居中区域状态信息
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,// 居中图片不旋转
          isCenter: true
        };

        //获得布局上侧图片的状态
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        // 布局上侧图片
        imgsArrangeTopArr.forEach((item,index) => {
          imgsArrangeTopArr[index].pos = {
            left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
            top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
          };
          imgsArrangeTopArr[index].rotate = getDegRandom();
          imgsArrangeTopArr[index].isCenter = false;
        });

        // 布局两侧图片信息
        for (var i = 0; i < imgsArrangeArr.length; i++){
          var hPosRangeLORX = null;

          // 前半部分位于左边，后半部分位于右边
          if ( i < imgsArrangeArr.length / 2 ){
            hPosRangeLORX = hPosRangeLeftSecX;
          }
          else{
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos:{
              left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
              top: getRangeRandom(hPosRangeY[0],hPosRangeY[1])
            },
            rotate: getDegRandom(),
            isCenter: false
          }
        }

        // 把上侧与中间状态重新塞回数组
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        // 重新修改state状态
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });

  }

  // 组建加载后每张图片的位置范围
  componentDidMount(){
    // 获取舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 获取imageFigure大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 中心图片位置范围
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 左右侧图片位置范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //上侧图片位置范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    // 初始化第1张图片居中
    this.rearrange(0);

  }

  render() {
    var controllerUnits=[],
        imgFigures=[];

    imageDatas.forEach((item,index) => {
      // 初始化图片位置
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          // 定位
          pos:{
            left:0,
            top:0
          },
          // 旋转
          rotate: 0,
          // 图片正反面
          isInverse: false,
          // 图片居中
          isCenter: true
        }
      }

      imgFigures.push(<ImgFigure data={item} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}  inverse={this.inverse(index)} center={this.center(index)} />);
    });

    return (
      <section className="stage" ref='stage'>
        <div className="img-sec">{imgFigures}</div>
    		<nav className="controller-nav">{controllerUnits}</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
