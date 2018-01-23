import React, {PropTypes, Component, cloneElement} from 'react';
import classNames from 'classnames';
import { inject } from 'lib/Injector';


class FocusPointField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FocusX: props.data ? props.data.X : 0,
      FocusY: props.data ? props.data.Y : 0
    };

    this.handleFocusChange = this.handleFocusChange.bind(this);
  }

  handleFocusChange({focusX, focusY}) {
    this.setState({
      FocusX: focusX,
      FocusY: focusY
    });

    const {onAutofill, name} = this.props;

    if (typeof onAutofill === 'function') {
      onAutofill(`${name}X`, focusX);
      onAutofill(`${name}Y`, focusY);
    }
  }

  handleFieldChange(childIndex, event) {
    const {children, name} = this.props;
    const childName = children[childIndex].props.name;
    let value = parseFloat(event.target.value);

    if (Number.isNaN(value)) {
      value = 0;
    }
    if (childName === `${name}X`) {
      this.setState({
        FocusX: value
      });
    } else {
      this.setState({
        FocusY: value
      });
    }
  }

  renderChildren(children, isDebug) {
    if (isDebug) {
      return children.map((child, key) => (
        cloneElement(child, {
          // overload the children change handler
          onChange: (e) => this.handleFieldChange(key, e),
          key,
        }, child.props.children)
      ))
    }

    return (children);
  }

  render() {
    const {extraClass, FocusPointPicker, FieldGroup, children} = this.props;
    const {showDebug, tooltip, previewUrl, previewWidth, previewHeight} = this.props.data;
    const {FocusX, FocusY} = this.state;

    const className = classNames('focuspoint-field', extraClass, {'focuspoint-field--debug': showDebug});

    return (
      <div className={className}>
        <FieldGroup {...this.props}>
          <div>
            <FocusPointPicker
              className="focuspoint-field__picker"
              imageUrl={previewUrl}
              focusX={FocusX}
              focusY={FocusY}
              width={Math.ceil(previewWidth * 0.5)}
              height={Math.ceil(previewHeight * 0.5)}
              tooltip={tooltip}
              onChange={this.handleFocusChange}
            />
          </div>
          {this.renderChildren(children, showDebug)}
        </FieldGroup>
      </div>
    )
  }
}

FocusPointField.defaultProps = {
  extraClass: ''
};

FocusPointField.propTypes = {
  extraClass: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  onAutofill: PropTypes.func,
  readOnly: React.PropTypes.bool
};

export { FocusPointField as Component };

export default inject(
  ['FieldGroup', 'FocusPointPicker']
)(FocusPointField);
//export default fieldHolder(FocusPointField);
