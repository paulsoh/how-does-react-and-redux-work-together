import {
  createStore,
} from 'redux';

// Redux를 이용해서 메뉴 주문하는 앱을 구성할 예정입니다
// 오늘의 학습 목표는:
// 1. 문제 정의를 듣고 그에 맞는 action creator 함수와 reducer를 구성할 수 있다.
// 2. Object datastructure를 이용하기 않고 Redux store를 사용하는 이유를 설명할 수 있다
// 3. Redux의 getState와dispatch 각각의 역할을 명확히 이해할 수 있다.
// 4. Redux와 React Component간을 직접(react-redux 없이) 연결할 수 있다.


// 문제 정의
// 중국집에서 메뉴 주문을 받는 상황
// 동시 다발적으로 각종 액션(메뉴 주문, 메뉴 취소, 메뉴 변경)들이 발생하고 있으며
// 주문을 대표해서 받는 사람은 매우 머리가 아프다
// 주문 상태에 대한 state를 redux를 이용해서 관리하고 싶은 마음에 직접 구성해보기로 한다


// 먼제 Action type들을 정리해보면
// 1. 메뉴 주문 액션
// 2. 메뉴 취소 액션
// 3. 메뉴 변경 액션
// 정도로 정리가 가능할 것 같다

// action type은 '동사' 느낌으로 구성하는 것이 좋기에 'MAKE_ORDER', 'CANCEL_ORDER', 'CHANGE_ORDER'
// 로 구성하기로 한다.

// "나 메뉴 주문할래", "나 메뉴 변경할래"
// 만으로는 주문 상태를 관리할 수 없으므로
// "나 ___ 메뉴 주문할래" 의 꼴이 되도록 ___에 대한 정보를 payload로 담아서 주는 것이 좋겠다
// CHANGE_ORDER의 경우에는 "나 A 메뉴에서 B 메뉴로 변경할래" 의 꼴이므로 A, B에 대한 정보를 둘다 담아서 Action을 발생시켜줘야 한다는 것에 주의하자

const makeOrderActionCreator = (payload) => {
  return {
    type: 'MAKE_ORDER',
    payload,
  }
}

const cancelOrderActionCreator = (payload) => {
  return {
    type: 'CANCEL_ORDER',
    payload,
  }
}

// payload = "짜장, 짬뽕"
const changeOrderActionCreator = (beforeMenu, afterMenu) => {
  return {
    type: 'CHANGE_ORDER',
    payload : {
      beforeMenu,
      afterMenu,
    },
  }
}

// Action Creator를 모두 구성했으니 Reducer를 구성해볼 차례

// 초기 상태를 다음과 같이 정의하고,
const INITAL_STATE = {
  orders: {
    '짜장': 0,
    '짬뽕': 0,
    '볶음밥': 0,
  }
}

// Reducer를 구성을 한다. Reducer는 명사의 형태로 최대한 범용적인 이름이 좋을 것 같다.
// Reducer에는 우리가 앞서 만든 3가지 종류의 액션 타입을 각각 처리 할 수 있도록 구성해야겠다.
// 액션만 발생시킨다고 redux가 '망가지지'는 않으나 우리가 의도한대로 nextState가 나오지 않을 것이기 때문에
// 반드시 모든 액션에 대한 처리 (if문, switch문)가 될 수 있도록 주의하자!
// 그리고 젭라 오타 주의하자!
const orderReducer = (state = INITAL_STATE, action = {}) => {
  // 나머지는 거의 동일한 구성이니
  // MAKE_ORDER type에 대해서만 state를 업데이트를 쳐주는 부분을 구성해보도록 하겠다
  if (action.type === 'MAKE_ORDER') {
    // 그 전 order를 일단 복사를 해놓는다
    const previousOrderState = { ...state.orders };

    // previousOrderState = {
    //   '짜장': 0,
    //   '짬뽕': 0,
    //   '볶음밥': 0,
    // } 와 같은 형태로 생겼을 것이다

    // 선택된 메뉴 previousOrderState[action.payload]값을 받아서 1을 추가한뒤
    // 새로운 state를 return 한다
    // 조금 낯설 수 있지만 이런 식으로 하면 된다. 단순한 주문 접수 기능 치고는 조금
    // 복잡해 보일 수있지만 FE개발자에게 ES6+는 제2외국어 급으로 친숙하므로 쉽게 이해를 하자
    return {
      ...state,
      orders: {
        ...state.orders,
        [action.payload]: previousOrderState[action.payload] + 1,
      }
    }

    return {
      ...state,
    }
  }

  // 지면이 부족해서 생략
  if (action.type === 'CANCEL_ORDER') {
    // TODO: 아직 미구현!
    return {
      ...state,
    }
  }
  // 지면이 부족해서 생략
  if (action.type === 'CHANGE_ORDER') {
    // TODO: 아직 미구현!
    return {
      ...state
    }
  }
  return {
    ...state,
  }
}

// 자 이럼. 우리 앱에서 필요한 Action들을 만들어 주는 Action Creator들과 
// 각 Action을 받아서 state를 업데이트 시켜줄 수 있는 Reducer를 구성하였다
const initialState = orderReducer();
const nextState = orderReducer(initialState, makeOrderActionCreator('볶음밥'));
// 와 같은 식으로 직접 action을 발생 reducer함수에 인자로 넘겨서 state를 업데이트 칠 수 있긴 하다.
console.log(initialState);
console.log(nextState);
// 위와 같이 redux없이도 redux 패러다임을 이용해서 state 관리를 할 수는 있다.
//
// 위에서 본 것 처럼 Redux없이도 Redux패러다임만을 이용하여 state를 관리할 수 있다.
// 하지만 실제로 사용하려다 보면 redux state의 변화를 감지한다든지, 직접 state를 바꿀 수 없게끔 제한을 한다든지에 대한 
// 필요성이 있는데 그런 몇 가지 부가 기능들이 redux에는 구현되어 있다.

// Redux는 store를 통해 redux state와 그 state를 변경하는 action을 날릴 수 있도록 해주는데
// store를 Redux state의 매니져 개념으로 생각하면 될 것 같다.
// store의 getState 메소드는 store에게 redux state를 요청하는 메소드이고
// store의 dispatch 메소드는 store에게 이런 action을 네 안의 reducer에게 전해줘...
//
// 위에서 했던 것을 redux를 이용해서 해보자면:

const store = createStore(orderReducer);

const initialStateWithRedux = store.getState();
console.log(initialStateWithRedux);
// action을 만들어서 store.dispatch에게 넘겨주면
store.dispatch(makeOrderActionCreator('짬뽕'));

const nextStateWithRedux = store.getState()
console.log(nextStateWithRedux);
// 위와 똑같은 형태라는 것을 볼 수 있다


// 자 그럼 우리의 redux store를 이용해서 실제 React Component에서 가져다가 사용을 해보자
// App.js를 보러 고고
export default store;
