/**
 * QuerystringWidget component.
 * @module components/manage/Widgets/QuerystringWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Grid, Input, Label } from 'semantic-ui-react';
import { filter, toPairs, groupBy, isEmpty, map } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { getQuerystring } from '@plone/volto/actions';
import { Icon } from '@plone/volto/components';
import { format, parse } from 'date-fns';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import cx from 'classnames';
import { setUnsavedConnectedDataParameters } from '@eeacms/volto-datablocks/actions';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

import clearSVG from '@plone/volto/icons/clear.svg';

import { DATACONNECTOR_PARAMS_GROUP } from '@eeacms/volto-datablocks/constants';

import { defaultOperations, defaultOperators } from './operations';

function filterIndexes(indexes) {
  const res = {};
  Object.keys(indexes).forEach((k) => {
    if (indexes[k].group === DATACONNECTOR_PARAMS_GROUP) res[k] = indexes[k];
  });
  return res;
}

const messages = defineMessages({
  Criteria: {
    id: 'Criteria',
    defaultMessage: 'Criteria',
  },
  AddCriteria: {
    id: 'Add criteria',
    defaultMessage: 'Add criteria',
  },
  select: {
    id: 'querystring-widget-select',
    defaultMessage: 'Select…',
  },
});

/**
 * QuerystringWidget component class.
 * @class QuerystringWidget
 * @extends Component
 */
class QuerystringWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.array,
    focus: PropTypes.bool,
    onChange: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    getQuerystring: PropTypes.func.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    error: [],
    value: null,
    onChange: null,
    onEdit: null,
    onDelete: null,
    focus: false,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs EditComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      visual: false,
      indexes: null,
    };
    this.initializeIndexes = this.initializeIndexes.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.getWidget = this.getWidget.bind(this);
  }

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props?.focus) {
      // needed?
      // this.node.focus();
    }
    this.props.getQuerystring();
    if (this.props.indexesLoaded) {
      this.initializeIndexes();
    }
  }

  /**
   * Component did update lifecycle method
   * @method componentDidUpdate
   * @returns {undefined}
   */
  componentDidUpdate(prevProps) {
    if (this.props.indexesLoaded && !this.state.indexes) {
      this.initializeIndexes();
    }

    // Check if value of indexes has changed and temp save
    // to redux store
    if (
      JSON.stringify(prevProps.formData) !== JSON.stringify(this.props.formData)
    ) {
      this.props.setUnsavedConnectedDataParameters(this.props.formData);
    }
  }

  /**
   * Initialize indexes
   * @method initializeIndexes
   * @returns undefined.
   */
  initializeIndexes() {
    const value = this.props.value;
    const indexes = {};
    if (value?.length) {
      value.forEach((param) => {
        if (!this.props.indexes[param.i] && !indexes[param.i]) {
          indexes[param.i] = {
            enabled: true,
            group: 'Custom',
            operations: defaultOperations,
            operators: defaultOperators,
            sortable: false,
            title: param.i,
            values: {},
          };
        }
      });
    }
    this.setState({ indexes });
  }

  /**
   * Get correct widget
   * @method getWidget
   * @param {Object} row Row object.
   * @param {number} index Row index.
   * @returns {Object} Widget.
   */
  getWidget(row, index, Select) {
    const props = {
      fluid: true,
      value: row.v,
      onChange: (data) => this.onChangeValue(index, data.target.value),
    };

    const indexes = { ...this.props.indexes, ...this.state.indexes };

    const values = indexes[row.i].values;

    switch (indexes[row.i].operators[row.o].widget) {
      case null:
        return <span />;
      case 'TextWidget':
        return (
          <Form.Field style={{ flex: '1 0 auto' }}>
            <Input
              {...props}
              onChange={(data) =>
                this.onChangeValue(index, [data.target.value])
              }
              value={row.v?.[0]}
            />
          </Form.Field>
        );
      case 'DateWidget':
        return (
          <Form.Field style={{ flex: '1 0 auto' }}>
            <Input
              type="date"
              {...props}
              value={format(parse(row.v), 'YYYY-MM-DD')}
            />
          </Form.Field>
        );
      case 'DateRangeWidget': // 2 date inputs
        return (
          <React.Fragment>
            <Form.Field style={{ flex: '1 0 auto' }}>
              <Input
                type="date"
                {...props}
                value={format(parse(row.v[0]), 'YYYY-MM-DD')}
                onChange={(data) =>
                  this.onChangeValue(index, [data.target.value, row.v[1]])
                }
              />
            </Form.Field>
            <Form.Field style={{ flex: '1 0 auto' }}>
              <Input
                type="date"
                {...props}
                value={format(parse(row.v[1]), 'YYYY-MM-DD')}
                onChange={(data) =>
                  this.onChangeValue(index, [row.v[0], data.target.value])
                }
              />
            </Form.Field>
          </React.Fragment>
        );
      case 'RelativeDateWidget':
        return (
          <Form.Field style={{ flex: '1 0 auto' }}>
            <Input step={1} type="number" {...props} />
          </Form.Field>
        );
      case 'MultipleSelectionWidget':
        return (
          <Form.Field style={{ flex: '1 0 auto', maxWidth: '93%' }}>
            <Select
              {...props}
              className="react-select-container"
              classNamePrefix="react-select"
              options={
                values
                  ? map(toPairs(values), (value) => ({
                      label: value[1].title,
                      value: value[0],
                    }))
                  : []
              }
              styles={customSelectStyles}
              placeholder={this.props.intl.formatMessage(messages.select)}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              onChange={(data) => {
                this.onChangeValue(
                  index,
                  map(data, (item) => item.value),
                );
              }}
              isMulti={true}
              value={map(row.v, (value) => ({
                label: values?.[value]?.title || value,
                value,
              }))}
            />
          </Form.Field>
        );
      case 'ReferenceWidget':
      default:
        // if (row.o === 'plone.app.querystring.operation.string.relativePath') {
        //   props.onChange = data => this.onChangeValue(index, data.target.value);
        // }
        return (
          <Form.Field style={{ flex: '1 0 auto' }}>
            <Input {...props} />
          </Form.Field>
        );
    }
  }

  /**
   * Change value handler
   * @method onChangeValue
   * @param {Number} index Index of the row.
   * @param {String|Array} value Value of the row.
   * @returns {undefined}
   */
  onChangeValue(index, value) {
    this.props.onChange(
      this.props.id,
      map(this.props.value, (row, i) =>
        index === i
          ? {
              ...row,
              v: value,
            }
          : row,
      ),
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      id,
      required,
      description,
      error,
      value,
      onChange,
      onEdit,
      fieldSet,
      reactSelect,
      reactSelectCreateable,
      intl,
    } = this.props;

    const indexes = { ...this.props.indexes, ...this.state.indexes };

    const Select = reactSelect.default;
    const Creatable = reactSelectCreateable.default;

    return (
      <Form.Field
        inline
        required={required}
        error={error.length > 0}
        className={cx('query-widget', description ? 'help' : '')}
        id={`${fieldSet || 'field'}-${id}`}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="12">
              <div className="simple-field-name">
                {this.props.title
                  ? this.props.title
                  : intl.formatMessage(messages.Criteria)}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column width="12">
              {indexes &&
                this.state.indexes &&
                !isEmpty(indexes) &&
                map(value, (row, index) => (
                  <Form.Group key={index}>
                    <div className="main-fields-wrapper">
                      <Form.Field
                        style={{ flex: '1 0 auto', marginRight: '10px' }}
                      >
                        <Creatable
                          id={`field-${id}`}
                          name={id}
                          disabled={onEdit !== null}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={map(
                            toPairs(
                              groupBy(
                                toPairs(indexes),
                                (item) => item[1].group,
                              ),
                            ),
                            (group) => ({
                              label: group[0],
                              options: map(group[1], (field) => ({
                                label: field[1].title,
                                value: field[0],
                              })),
                            }),
                          )}
                          styles={customSelectStyles}
                          theme={selectTheme}
                          placeholder={intl.formatMessage(messages.select)}
                          components={{ DropdownIndicator, Option }}
                          value={{
                            value: row.i,
                            label: indexes[row.i]?.title,
                          }}
                          onCreateOption={(key) => {
                            if (!this.state.indexes) return;
                            if (!this.state.indexes[key]) {
                              this.setState((prevState) => ({
                                indexes: {
                                  ...prevState.indexes,
                                  [key]: {
                                    enabled: true,
                                    group: 'Custom',
                                    operations: defaultOperations,
                                    operators: defaultOperators,
                                    sortable: false,
                                    title: key,
                                    values: {},
                                  },
                                },
                              }));
                            }
                            onChange(
                              id,
                              map(value, (curRow, curIndex) =>
                                curIndex === index
                                  ? {
                                      i: key,
                                      o: defaultOperations[0],
                                      v: '',
                                    }
                                  : curRow,
                              ),
                            );
                          }}
                          onChange={(data) =>
                            onChange(
                              id,
                              map(value, (curRow, curIndex) =>
                                curIndex === index
                                  ? {
                                      i: data.value,
                                      o: indexes[data.value].operations[0],
                                      v: '',
                                    }
                                  : curRow,
                              ),
                            )
                          }
                        />
                      </Form.Field>
                      <Form.Field style={{ flex: '1 0 auto' }}>
                        <Select
                          id={`field-${id}`}
                          name={id}
                          disabled={onEdit !== null}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={map(
                            indexes[row.i].operations,
                            (operation) => ({
                              value: operation,
                              label: indexes[row.i].operators[operation].title,
                            }),
                          )}
                          styles={customSelectStyles}
                          theme={selectTheme}
                          placeholder={intl.formatMessage(messages.select)}
                          components={{ DropdownIndicator, Option }}
                          value={{
                            value: row.o,
                            label: indexes[row.i].operators[row.o].title,
                          }}
                          onChange={(data) =>
                            onChange(
                              id,
                              map(value, (curRow, curIndex) =>
                                curIndex === index
                                  ? {
                                      i: row.i,
                                      o: data.value,
                                      v: '',
                                    }
                                  : curRow,
                              ),
                            )
                          }
                        />
                      </Form.Field>
                      {!indexes[row.i].operators[row.o].widget && (
                        <Button
                          onClick={(event) => {
                            onChange(
                              id,
                              filter(value, (v, i) => i !== index),
                            );
                            event.preventDefault();
                          }}
                          style={{
                            background: 'none',
                            paddingRight: 0,
                            paddingLeft: 0,
                            margin: 0,
                          }}
                        >
                          <Icon name={clearSVG} size="24px" className="close" />
                        </Button>
                      )}
                    </div>
                    {this.getWidget(row, index, Creatable)}
                    {indexes[row.i].operators[row.o].widget && (
                      <Button
                        onClick={(event) => {
                          onChange(
                            id,
                            filter(value, (v, i) => i !== index),
                          );
                          event.preventDefault();
                        }}
                        style={{
                          background: 'none',
                          paddingRight: 0,
                          paddingLeft: 0,
                          margin: 0,
                        }}
                      >
                        <Icon name={clearSVG} size="24px" className="close" />
                      </Button>
                    )}
                  </Form.Group>
                ))}
              <Form.Group>
                <Form.Field style={{ flex: '1 0 auto' }}>
                  <Creatable
                    id={`field-${id}`}
                    name={id}
                    disabled={onEdit !== null}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder={intl.formatMessage(messages.AddCriteria)}
                    options={[
                      ...map(
                        toPairs(
                          groupBy(toPairs(indexes), (item) => item[1].group),
                        ),
                        (group) => ({
                          label: group[0],
                          options: map(
                            filter(group[1], (item) => item[1].enabled),
                            (field) => ({
                              label: field[1].title,
                              value: field[0],
                            }),
                          ),
                        }),
                      ),
                    ]}
                    styles={customSelectStyles}
                    theme={selectTheme}
                    components={{ DropdownIndicator, Option }}
                    value={null}
                    onCreateOption={(key) => {
                      if (!this.state.indexes) return;
                      if (!this.state.indexes[key]) {
                        this.setState((prevState) => ({
                          indexes: {
                            ...prevState.indexes,
                            [key]: {
                              enabled: true,
                              group: 'Custom',
                              operations: defaultOperations,
                              operators: defaultOperators,
                              sortable: false,
                              title: key,
                              values: {},
                            },
                          },
                        }));
                      }
                      onChange(id, [
                        ...(value || []),
                        {
                          i: key,
                          o: defaultOperations[0],
                          v: '',
                        },
                      ]);
                    }}
                    onChange={(data) => {
                      onChange(id, [
                        ...(value || []),
                        {
                          i: data.value,
                          o: indexes[data.value].operations[0],
                          v: '',
                        },
                      ]);
                    }}
                  />
                </Form.Field>
              </Form.Group>
              {map(error, (message) => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    );
  }
}

export default compose(
  injectIntl,
  injectLazyLibs(['reactSelect', 'reactSelectCreateable']),
  connect(
    (state) => ({
      indexes: filterIndexes(state.querystring.indexes),
      indexesLoaded: state.querystring.loaded,
    }),
    { getQuerystring, setUnsavedConnectedDataParameters },
  ),
)(QuerystringWidget);
