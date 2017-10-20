import React from 'react'


export default class Menu extends React.Component {
  addJJajang = () => {
    if (this.props.dispatch) {
      this.props.dispatch({
        type: 'MAKE_ORDER',
        payload: '짜장',
      })
    } else if (this.props.addJJajangToOrders) {
      this.props.addJJajangToOrders()
    }
  }

  render() {
    let a, b, c;
    if (this.props.state) {
      a = this.props.state.orders['짜장'];
      b = this.props.state.orders['짬뽕'];
      c = this.props.state.orders['볶음밥'];
    } else if (this.props.orders) {
      a = this.props.orders['짜장'];
      b = this.props.orders['짬뽕'];
      c = this.props.orders['볶음밥'];
    }

    return (
      <div>
        Menu
        <div>
          <h1>
            짜장
          </h1>
          <div>
            {a}
          </div>
          <div>
            <button
              onClick={this.addJJajang}
            >
              추가
            </button>
          </div>
        </div>
        <div>
          <h1>
            짬뽕
          </h1>
          <div>
            {b}
          </div>
        </div>
        <div>
          <h1>
            볶음밥
          </h1>
          <div>
            {c}
          </div>
        </div>
      </div>
    );
  }
}
