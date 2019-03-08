import * as React from 'react';
import StickyContainer from './StickyContainer';
export interface StickyProps {
  topOffset: number;
  bottomOffset: number;
  relative?: boolean;
  children: (props:any) => any;
  disableCompensation:boolean;
  disableHardwareAcceleration:boolean;
}

export interface StickyContextProps {
  subscribe: () => void;
  unsubscribe: () => void;
  getParent:  () => void;
}

interface State {
  isSticky: boolean;
  wasSticky: boolean;
  style: React.CSSProperties;
  calculatedHeight:number;
  distanceFromTop?:number;
  distanceFromBottom?:number;
}
export default class Sticky extends React.PureComponent<StickyProps,State> {

  StickyContainer = StickyContainer;

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    disableCompensation: false,
    disableHardwareAcceleration: false,
  };

  static contextTypes :StickyContextProps ;

  placeholder:any;
  content:HTMLDivElement;

  constructor(props:StickyProps) {
    super(props);
    this.createPlaceholderRef = this.createPlaceholderRef.bind(this);
    this.createContentRef = this.createContentRef.bind(this);
    this.handleContainerEvent = this.handleContainerEvent.bind(this);
    this.state = {
      isSticky: false,
      wasSticky: false,
      style: {},
      calculatedHeight:0,
    };
  }

  componentWillMount() {
    if (!this.context.subscribe) throw new TypeError('Expected Sticky to be mounted within StickyContainer');

    this.context.subscribe(this.handleContainerEvent);
  }

  componentDidUpdate() {
    this.placeholder.style.paddingBottom = this.props.disableCompensation
      ? 0
      : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`;
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent);
  }

  // @ts-ignore
  handleContainerEvent({distanceFromTop, distanceFromBottom, eventSource}) {
    const {relative, bottomOffset, topOffset, disableHardwareAcceleration} = this.props;
    const parent = this.context.getParent();
    let preventingStickyStateChanges = false;
    if (relative) {
      preventingStickyStateChanges = eventSource !== parent;
      distanceFromTop = -(eventSource.scrollTop + eventSource.offsetTop) + this.placeholder.offsetTop;
    }

    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;

    const bottomDifference = distanceFromBottom - bottomOffset - calculatedHeight;
    const wasSticky = !!this.state.isSticky;

    const isSticky = preventingStickyStateChanges
      ? wasSticky
      : distanceFromTop <= -topOffset && distanceFromBottom > -bottomOffset;
    distanceFromBottom =
      (this.props.relative ? parent.scrollHeight - parent.scrollTop : distanceFromBottom) - calculatedHeight;
    const style = !isSticky
      ? {}
      : {
          position: 'fixed',
          top:
            bottomDifference > 0
              ? this.props.relative
                ? parent.offsetTop - parent.offsetParent.scrollTop
                : 0
              : bottomDifference,
          left: placeholderClientRect.left,
          width: placeholderClientRect.width,
        } as React.CSSProperties;
    if (!disableHardwareAcceleration) {
      style.transform = 'translateZ(0)';
    }

    this.setState({
      isSticky,
      wasSticky,
      distanceFromTop,
      distanceFromBottom,
      calculatedHeight,
      style,
    });
  }

  createPlaceholderRef(placeholder:HTMLDivElement) {
    this.placeholder = placeholder;
  }

  createContentRef(content:HTMLDivElement) {
    this.content = content;
  }

  render() {
    const element = React.cloneElement(
      this.props.children({
        isSticky: this.state.isSticky,
        wasSticky: this.state.wasSticky,
        distanceFromTop: this.state.distanceFromTop,
        distanceFromBottom: this.state.distanceFromBottom,
        calculatedHeight: this.state.calculatedHeight,
        style: this.state.style,
      }),
      {
        ref: this.createContentRef,
      }
    );
    return (
      <div>
        <div ref={this.createPlaceholderRef} />
        {element}
      </div>
    );
  }
}
