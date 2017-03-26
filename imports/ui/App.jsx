import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Transactions } from '../api/transactions.js';
import Transaction from './Transaction.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';

// App component - represents the whole app
class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      controlledDate: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, date) {
    this.setState({
      controlledDate: date,
    });
  };

  renderTransactions() {
    return this.props.transactions.map((transaction) => (
      <Transaction key={transaction._id} transaction={transaction} />
    ));
  }

  handleSubmit(event){
    event.preventDefault();

    // Find the text field via the React ref
    const amount = ReactDOM.findDOMNode(this.refs.amount).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.description).value.trim();
    const account = Number(ReactDOM.findDOMNode(this.refs.account).value.trim());
    const io = ReactDOM.findDOMNode(this.refs.io).value.trim();
    const date = this.state.controlledDate;
    console.log("inserted! ", amount+ ":"+ account + ":" + description+ ":"+ io+ ":" + date);

    Transactions.insert({
      amount: amount,
      account: account,
      description: description,
      io: io,
      date: date // date selected by the user
    });



    // Clear form
    ReactDOM.findDOMNode(this.refs.amount).value = '';
    ReactDOM.findDOMNode(this.refs.description).value = '';
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="all">
          <div className="container">
            <header>
              <h1>Kipcount</h1>
              <form className="new-transaction" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="amount"
                placeholder="Type amount"
              />
              <select
                ref="account"
                name="Account">
                <option value="1">Cash</option>
                <option value="2">Bank</option>
              </select>

              <select
                ref="io"
                name="Income or expense">
                <option value="in">Income</option>
                <option value="out">Expense</option>
              </select>
              <textarea
                name="message"
                rows="4"
                cols="20"
                ref="description"
                placeholder="Describe the transaction"
                >

              </textarea>
              <DatePicker
                      hintText="Controlled Date Input"
                      value={this.state.controlledDate}
                      onChange={this.handleChange}
              />

             <input type="submit" value="Submit" />
            </form>

            </header>

            <ul>
              {this.renderTransactions()}
            </ul>

            <div className="summary">
              Here we will have the summary of the current transactions
            </div>
          </div>

          <div className="total">
            Total panel with the general balance of the person
          </div>

          <div className="accounts">
            accounts information
          </div>

        </div>
        </MuiThemeProvider>



    );
  }
}

App.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    transactions: Transactions.find({}).fetch(),
  };
}, App);