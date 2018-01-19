import React, {PropTypes, Component} from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { loadComponent } from 'lib/Injector';
import FormAlert from 'components/FormAlert/FormAlert';
//TODO: Replace this with injected props, once the React injection API has stabilized
const HiddenField = loadComponent('HiddenField');
const FocusPointPicker = loadComponent('FocusPointPicker');

class FocusPointField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FocusX: props.data ? props.data.X : 0,
      FocusY: props.data ? props.data.Y : 0
    };

    this.handleFocusChange = this.handleFocusChange.bind(this);
  }

  componentWillReceiveProps(nextProps)
  {
    if (nextProps.value !== this.props.value) {
      const values = JSON.parse(nextProps.value);
      this.setState({
        FocusX: values.X,
        FocusY: values.Y
      });
    }
  }

  handleFocusChange({focusX, focusY}) {
    /*
    this.setState({
      FocusX: focusX,
      FocusY: focusY
    });
    */
    const val = JSON.stringify({
      X: focusX,
      Y: focusY
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(val, { id: this.props.id, value: val });
    }
  }

  render() {
    const {name, extraClass} = this.props;
    const {showDebug, tooltip, previewUrl, previewWidth, previewHeight} = this.props.data;
    const {FocusX, FocusY} = this.state;

    return (
      <div className={`focuspoint-field ${extraClass}`}>
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
        <HiddenField name={`${name}X`} value={FocusX} />
        <HiddenField name={`${name}Y`} value={FocusY} />
        { showDebug &&
          <FormAlert type="info" value={`X: ${FocusX} / Y: ${FocusY}`}/>
        }
      </div>
    )
  }
}

FocusPointField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  attributes: {},
};

FocusPointField.propTypes = {
  extraClass: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  readOnly: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  type: React.PropTypes.string,
  autoFocus: React.PropTypes.bool,
  attributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
};

export { FocusPointField as Component };

export default fieldHolder(FocusPointField);
