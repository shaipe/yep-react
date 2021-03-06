---
order: 0
title: 基础用法
description:
---

```js
import React from 'react';
import {Popup, Button, WhiteSpace} from '@jdcfe/yep-react';
import ComponentCard from 'ComponentCard';
class Demo extends React.PureComponent {
  constructor() {
    super();
    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleToggleSlideDownShow = this.handleToggleSlideDownShow.bind(this);
    this.handleToggleSlideRightShow = this.handleToggleSlideRightShow.bind(this);
    this.state = {
      show: false,
      slideDownShow: false,
      slideRightShow: false,
    };
  }

  handleToggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  handleToggleSlideDownShow() {
    this.setState({
      slideDownShow: !this.state.slideDownShow,
    });
  }
  handleToggleSlideRightShow() {
    this.setState({
      slideRightShow: !this.state.slideRightShow,
    });
  }

  render() {
    return (
      <div title="Popup">
        <ComponentCard title="基础用法">
          <Button type="primary" onClick={this.handleToggleShow}>
            显示
          </Button>
          <WhiteSpace />
          <Button onClick={this.handleToggleSlideDownShow}>从上向下显示</Button>
          <WhiteSpace />
          <Button type="primary" onClick={this.handleToggleSlideRightShow}>
            从右向左显示
          </Button>
        </ComponentCard>

        <Popup show={this.state.show} onCancel={this.handleToggleShow}>
          <div className="ul">
            <div
              className="cur"
              onClick={() => {
                alert('未婚');
              }}
            >
              未婚
            </div>
            <div
              className=""
              onClick={() => {
                alert('已婚');
              }}
            >
              已婚
            </div>
            <div
              className=""
              onClick={() => {
                alert('离异');
              }}
            >
              离异
            </div>
          </div>
        </Popup>

        <Popup show={this.state.slideDownShow} onCancel={this.handleToggleSlideDownShow} popupTransition="slide-down">
          <div className="up">
            <div
              className="cur"
              onClick={() => {
                alert('未婚');
              }}
            >
              未婚
            </div>
          </div>
        </Popup>
        <Popup
          show={this.state.slideRightShow}
          onCancel={this.handleToggleSlideRightShow}
          popupTransition="slide-right"
        >
          <div className="right">
            <div
              className="cur"
              onClick={() => {
                alert('未婚');
              }}
            >
              未婚
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
