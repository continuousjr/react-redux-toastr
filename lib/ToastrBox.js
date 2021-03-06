'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CSSCore = require('fbjs/lib/CSSCore');

var _CSSCore2 = _interopRequireDefault(_CSSCore);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ProgressBar = require('./ProgressBar');

var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); } //  eslint-disable-line no-unused-vars


var ToastrBox = function (_Component) {
  _inherits(ToastrBox, _Component);

  function ToastrBox(props) {
    _classCallCheck(this, ToastrBox);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    var _props$item$options = props.item.options,
        transitionIn = _props$item$options.transitionIn,
        transitionOut = _props$item$options.transitionOut;


    _this.isHiding = false;
    _this.shouldClose = false;
    _this.intervalId = null;

    _this.transitionIn = transitionIn || _this.props.transitionIn;
    _this.transitionOut = transitionOut || _this.props.transitionOut;

    _this.state = { progressBar: null };

    (0, _utils._bind)(['renderSubComponent', 'renderIcon', 'renderToastr', 'renderCloseButton', 'renderMessage', '_onAnimationComplete', '_removeToastr', '_setTransition', '_clearTransition', '_setIntervalId', '_setIsHiding', '_setShouldClose'], _this);
    return _this;
  }

  ToastrBox.prototype.componentDidMount = function componentDidMount() {
    var item = this.props.item;

    if (this.props.inMemory[item.id]) return;

    var timeOut = this._getItemTimeOut();

    if (timeOut) {
      this._setIntervalId(setTimeout(this._removeToastr, timeOut));
    }

    if (timeOut && item.options.progressBar) {
      this.setState({ progressBar: { duration: this._getItemTimeOut() } });
    }

    this._setTransition();
    (0, _utils.onCSSTransitionEnd)(this.toastrBox, this._onAnimationComplete);
    this.props.addToMemory(item.id);
  };

  ToastrBox.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  };

  ToastrBox.prototype.handleClick = function handleClick() {
    var onCloseButtonClick = this.props.item.options.onCloseButtonClick;


    if (onCloseButtonClick) {
      onCloseButtonClick();
    }

    this._setShouldClose(true);
    this._removeToastr();
  };

  ToastrBox.prototype.mouseEnter = function mouseEnter() {
    clearTimeout(this.intervalId);

    this._setIntervalId(null);
    this._setIsHiding(false);

    var progressBar = this.props.item.options.progressBar;

    var timeOut = this._getItemTimeOut();

    if (timeOut && progressBar) {
      this.setState({ progressBar: null });
    }
  };

  ToastrBox.prototype.mouseLeave = function mouseLeave() {
    var removeOnHover = this.props.item.options.removeOnHover;


    if (!this.isHiding && (removeOnHover || this.shouldClose)) {
      this._setIntervalId(setTimeout(this._removeToastr, 1000));

      var progressBar = this.props.item.options.progressBar;

      var timeOut = this._getItemTimeOut();

      if (timeOut && progressBar) {
        this.setState({ progressBar: { duration: 1000 } });
      }
    }
  };

  ToastrBox.prototype.renderSubComponent = function renderSubComponent() {
    var _this2 = this;

    var _props$item = this.props.item,
        id = _props$item.id,
        options = _props$item.options;


    var removeCurrentToastrFunc = function removeCurrentToastrFunc() {
      return _this2.props.remove(id);
    };

    if ((0, _react.isValidElement)(options.component)) {
      return _react2.default.cloneElement(options.component, {
        remove: removeCurrentToastrFunc
      });
    }

    return _react2.default.createElement(options.component, { remove: removeCurrentToastrFunc });
  };

  ToastrBox.prototype.renderIcon = function renderIcon() {
    var _props$item2 = this.props.item,
        type = _props$item2.type,
        options = _props$item2.options;


    if ((0, _react.isValidElement)(options.icon)) {
      return _react2.default.cloneElement(options.icon);
    }

    var iconName = type === 'light' ? options.icon : type;
    return _react2.default.createElement(_Icon2.default, { name: iconName });
  };

  ToastrBox.prototype.renderCloseButton = function renderCloseButton() {
    return _react2.default.createElement(
      'button',
      {
        type: 'button',
        className: 'close-toastr',
        onClick: this.handleClick.bind(this)
      },
      'x'
    );
  };

  ToastrBox.prototype.renderToastr = function renderToastr() {
    var _props$item3 = this.props.item,
        type = _props$item3.type,
        options = _props$item3.options,
        message = _props$item3.message,
        title = _props$item3.title;


    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'toastr-left-container' },
        _react2.default.createElement(
          'div',
          { className: 'holder' },
          this.renderIcon()
        )
      ),
      options.status && type === 'light' && _react2.default.createElement('div', { className: (0, _classnames2.default)('toastr-status', options.status) }),
      _react2.default.createElement(
        'div',
        { className: 'toastr-middle-container' },
        title && _react2.default.createElement(
          'div',
          { className: 'title' },
          title
        ),
        message && _react2.default.createElement(
          'div',
          { className: 'message' },
          message
        ),
        options.component && this.renderSubComponent()
      ),
      _react2.default.createElement(
        'div',
        { className: 'toastr-right-container' },
        options.showCloseButton && this.renderCloseButton()
      ),
      this.state.progressBar ? _react2.default.createElement(_ProgressBar2.default, this.state.progressBar) : null
    );
  };

  ToastrBox.prototype.renderMessage = function renderMessage() {
    var _props$item4 = this.props.item,
        title = _props$item4.title,
        message = _props$item4.message;


    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'title' },
        title,
        this.renderCloseButton()
      ),
      _react2.default.createElement(
        'div',
        { className: 'message' },
        message
      )
    );
  };

  ToastrBox.prototype.toastr = function toastr() {
    if (this.props.item.type === 'message') {
      return this.renderMessage();
    }

    return this.renderToastr();
  };

  ToastrBox.prototype._getItemTimeOut = function _getItemTimeOut() {
    var item = this.props.item;
    var timeOut = item.options.timeOut;

    if (typeof timeOut === 'undefined') {
      timeOut = this.props.timeOut;
    }

    return timeOut;
  };

  ToastrBox.prototype._onAnimationComplete = function _onAnimationComplete() {
    var _props = this.props,
        remove = _props.remove,
        item = _props.item;
    var options = item.options,
        id = item.id;


    if (this.isHiding) {
      this._setIsHiding(false);
      remove(id);
      if (options.onHideComplete) {
        options.onHideComplete();
      }
    } else if (!this.isHiding && options.onShowComplete) {
      options.onShowComplete();
    }
  };

  ToastrBox.prototype._removeToastr = function _removeToastr() {
    if (!this.isHiding) {
      this._setIsHiding(true);
      this._setTransition(true);
      (0, _utils.onCSSTransitionEnd)(this.toastrBox, this._onAnimationComplete);
    }
  };

  ToastrBox.prototype._setTransition = function _setTransition(hide) {
    var node = this.toastrBox;
    var animationType = hide ? this.transitionOut : this.transitionIn;

    var onEndListener = function onEndListener(e) {
      if (e && e.target == node) {
        _CSSCore2.default.removeClass(node, animationType);
      }
    };

    (0, _utils.onCSSTransitionEnd)(this.toastrBox, onEndListener);
    _CSSCore2.default.addClass(node, animationType);
  };

  ToastrBox.prototype._clearTransition = function _clearTransition() {
    var node = this.toastrBox;
    _CSSCore2.default.removeClass(node, this.transitionIn);
    _CSSCore2.default.removeClass(node, this.transitionOut);
  };

  ToastrBox.prototype._setIntervalId = function _setIntervalId(intervalId) {
    this.intervalId = intervalId;
  };

  ToastrBox.prototype._setIsHiding = function _setIsHiding(val) {
    this.isHiding = val;
  };

  ToastrBox.prototype._setShouldClose = function _setShouldClose(val) {
    this.shouldClose = val;
  };

  ToastrBox.prototype.render = function render() {
    var _this3 = this;

    var _props$item5 = this.props.item,
        options = _props$item5.options,
        type = _props$item5.type;


    return _react2.default.createElement(
      'div',
      {
        ref: function ref(_ref) {
          return _this3.toastrBox = _ref;
        },
        className: (0, _classnames2.default)('toastr', 'animated', type, options.className),
        onMouseEnter: this.mouseEnter.bind(this),
        onMouseLeave: this.mouseLeave.bind(this)
      },
      this.toastr()
    );
  };

  return ToastrBox;
}(_react.Component);

ToastrBox.displayName = 'ToastrBox';
ToastrBox.propTypes = {
  item: _react.PropTypes.object.isRequired
};
exports.default = ToastrBox;