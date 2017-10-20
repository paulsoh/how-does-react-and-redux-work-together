import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './reduxFromScratch';
// reduxFromScratch.js에서 createStore를 했고 export default를 해줬기 떄문에 여기에서 store를 import한다
import store from './reduxFromScratch';
import Menu from './Menu';
// 원래는 react-redux를 이용하면 매우 편리하게 redux store와 react component를 연결 할 수 있으나 본 예제에서는 redux에 대한 이해도 향상을 위해 store.getState 와 store.dispatch 그리고 직접 쓸일은 거의 없지만 store.subscribe를 직접 이용해서 연결해보도록 하겠다

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // App.js는 우리 앱의 최상단 Component이다.
      // 바로 이곳에서 reduxState라는 이름으로 redux의 state값을 저장하도록 하겠다.
      reduxState: store.getState(),
    }
  }

  render() {
    console.log(store);
    store.subscribe(() => {
      console.log('state has been updated');
      this.setState({
        reduxState: store.getState(),
      })
      
    })
    return (
      <div className="App">
        {/*
        Menu라는 Component에서 redux store로 부터 데이터를 받아서 사용해야 하는 상황이다. 그렇기 때문에 "state"라는 이름으로 store.getState() 를 넣어주고자 한다
          */}
        {/*
        그리고 Menu Component에서는 각종 메뉴에 대한 주문 추가 이벤트가 발생할 수 있다. 그렇기 때문에 각각의 액션이 발상할 경우 store.dispatch에게 그 값이 전달될 수 있도록 store.dispatch를 "dispatch" 라는 이름의 props로 넘겨 주었다ㅓ
          */}
        <Menu
          state={store.getState()}
          dispatch={store.dispatch}
        />
        {/*
        위의 방법대로 state와 dispatch를 주고 Menu Component에서 연결을 하면 치명적인 문제가 있다
        action이 dispatch는 되지만 redux state의 결과가 즉석으로 업데이트 되지 않는다.
        Menu Component에서 업데이트가 일어나기 위해서는 Menu Component 내부의 state 값에 변화가 있거나 Menu Component로 넘겨지는 props에 변화가 있어야되기 때문인데 store.getState()의 형태로 넘겨주었기 때문에 그렇다. store.getState()는 모양만 봐도 그러지만 함수가 호출되는 형태로 초기 render에서 한번 실행을 시켜줄 뿐, store내부의 state가 바뀌었다고 해서 새로 실행이 되지는 않는다
          */}
          {/*
          그렇기 때문에 this.state에 reduxState라는 이름으로 store.getState()를 넣어주었다.
          그렇다면 store에서 dispatch가 일어났을 때마다 알려주는 메소드가 있으면 좋으련만...
            */}
            {/* 그게 바로 store.subscribe 이다 */}
            {/*
            store.subscribe(() => {
              // store.dispatch가 실행이 되면 
              // 요기 함수가 실행이 되다
              // 그럼 여기에서 
              // this.setState({
              //   reduxState: store.getState(),
              // })
              // 를 해준다면
              // store.dispatch가 호출될때마다
              // 최신의 redux state를 
              // App.js의 state인 reduxState로 업데이트 해주게 된다
            })
              */}
          {/* 그럼 밑에서도 this.state.reduxState로
          바꿔주게 되면 action이 dispatch될 때마다
          update 된 reduxState가 Menu component로 잘 넘어가게 된다 */}
        <Menu
          state={this.state.reduxState}
          dispatch={store.dispatch}
        />
        {/*
        redux store와 react component를 직접 연결해서 사용하는 방법을 알아보았다. react-redux도 이와 비슷한 원리로 작동한다고 생각하면 될 것이다. 이 앱에서는 App.js가 최상단 Component라고 생각한 것 처럼 react-redux에서도 Provider가 그런 역할을 한다고 보면 될 것 같다
          */}
          {/*
          (부록) 한가지만 더 넘겨짚고 가자면...
          위와 같이 state와 dispatch를 통째로 주는 것도 안될 것은 없지만. 뭔가 조금은 아쉽다
          크게 두 가지 이유에서 아쉬운데
          하나는 redux state가 복잡할 경우. 예를 들어 orders 말고도 members, posts, articles 등등 규모가 클 경우에는 Menu Component는 orders 값만 보면 됨에도 불구하고 커다란 state 저 멀리 어디에선가 값이 바뀌어도 Menu component는 업데이트가 된다. (물론 shouldComponentUpdate 생명주기 함수에서 orders외의 변경이면 update가 안되도록 막을 수 있지만 여간 성가신 일이 아닐 것이다! reduxState 중에서도 Menu component가 필요한 props들을 명시하는 방법이 있으면 좋을 것 같다)
          두번 쨰도 비슷한 개념인데 dispatch를 통쨰로 주는 것보다는 Menu component내에서 어떤 액션들이 발생할 수 있는지가 조금 더 명시적으로 나타날 수 있었으면 좋을 것 같다
          mapStateToProps, mapDispatchToProps 는 밑에 정의 했음!
            */}
        <Menu
          orders={mapStateToProps(this.state.reduxState).orders}
          addJJajangToOrders={mapDispatchToProps(store.dispatch).addJJajangToOrders}
        />
        {/*
         뭔가 막연하게 외워서 사용했던 mapStateToProps과 mapDispatchToProps가 왜 그런 형태였는지 와닿지 않으신지!?
         이걸 다시 쓰면
          */}
        <Menu
          {...mapStateToProps(this.state.reduxState)}
          {...mapDispatchToProps(store.dispatch)}
        />
        {/* connect도 이런 식으로 작동을 하는거겠군요! */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  orders: state.orders,
})

const mapDispatchToProps = (dispatch) => ({
  addJJajangToOrders: () => dispatch({ type: 'MAKE_ORDER', payload: '짜장' })
})

export default App;
