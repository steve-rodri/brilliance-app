export const FETCH_EVENTS = "FETCH_EVENTS";
export const FETCH_EVENTS_PENDING = "FETCH_EVENTS_PENDING";
export const FETCH_EVENTS_REJECTED = "FETCH_EVENTS_REJECTED";
export const FETCH_EVENTS_FULFILLED = "FETCH_EVENTS_FULFILLED";

// export function foo() {
//   return dispatch => ({
//     type: 'FOO_ACTION',
//     payload: new Promise(() => {
//       throw new Error('foo');
//     })
//   }).catch(error => {
//     console.log(error.message); // 'foo'
//     // Dispatch a second action in response to the error
//     dispatch(bar());
//   });
// }
