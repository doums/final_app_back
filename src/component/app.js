import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import '../style.css'
import Select from 'react-select'

const options = [
  { value: 'not started yet', label: 'not started yet' },
  { value: 'in preparation', label: 'in preparation' },
  { value: 'ready', label: 'ready' },
  { value: 'served', label: 'served' }
]

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      order: null,
      table: null,
      userId: null
    }
  }

  handleChange = (item, option) => {
    const { order, table, orderId, userId } = this.state
    const newOrder = { order, table, userId }
    const index = newOrder.order.content.findIndex(elem => elem.key === item.key)
    newOrder.order.content[index].status = option.value
    console.log(item)
    console.log(option)
    this.back.collection('orders').doc(orderId).set(newOrder)
  }

  orderStatus = status => {
    const { order, table, orderId, userId } = this.state
    const newOrder = { order, table, userId }
    newOrder.order.status = status.value
    console.log(status)
    this.back.collection('orders').doc(orderId).set(newOrder)
  }

  async componentDidMount () {
    var config = {
      apiKey: "AIzaSyBJDNaUFoJdY04vSGWPy1YeklFMBUK5R4w",
      authDomain: "lab-3-dd17c.firebaseapp.com",
      databaseURL: "https://lab-3-dd17c.firebaseio.com",
      projectId: "lab-3-dd17c",
      storageBucket: "lab-3-dd17c.appspot.com",
      messagingSenderId: "97742818833"
    }
    firebase.initializeApp(config)
    const settings = {
      timestampsInSnapshots: true
    }
    this.back = firebase.firestore()
    this.back.settings(settings)
    try {
      const orders = this.back.collection('orders').onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const order = doc.data()
          if (order) {
            this.setState({
              order: order.order,
              table: order.table,
              orderId: doc.id,
              userId: order.userId
            })
          } else {
            this.setState({
              order: null,
              orderId: null,
              table: null,
              userId: order.userId
            })
          }
        })
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  render () {
    console.log(this.state)
    const { order, table } = this.state
    if (!order && !table){
      return (
        <div className='hello'>
          <div className='title'>BACK OFFICE</div>
          <div>No order currently</div>
        </div>
      )
    }
    return (
      <div className='hello'>
        <div className='title'>BACK OFFICE</div>
        {
          order &&
          order.content.map(item =>
            <li key={item.key} className='itemOrder'>
              {`${item.name} `}
              {item.quantity}
              <Select
                value={{ value: item.status, label: item.status }}
                onChange={option => this.handleChange(item, option)}
                options={options}
              />
            </li>)
        }
        {
          order && <div className='orderStatus'>
            Order status:
            <Select
              value={{ value: order.status, label: order.status }}
              onChange={this.orderStatus}
              options={options}
            />
          </div>
        }
        {
          table &&
          <div>{ table.name } </div>
        }
      </div>
    )
  }
}
export default hot(module)(App)
