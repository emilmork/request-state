jest.unmock('../src');
jest.unmock('immutable');

const RequestState = require('../src/index.js');

 
describe('States', () => {
  it('should have isNotAsked as initial state state', () => {
    let rs = new RequestState();

    expect(rs.isNotAsked()).toBe(true);

    const newState = rs.success({ foo: 'bar' });

    expect(newState.isNotAsked()).toBe(false);
    expect(newState.isSuccess()).toBe(true);
    expect(newState.getData().foo).toBe('bar');
  });

 it('should return isError true and error message', () => {
    let rs = new RequestState();

    const newState = rs.error({ message: 'Could not fetch data' });

    expect(newState.isSuccess()).toBe(false);
    expect(newState.isError()).toBe(true);

    expect(newState.getError().message).toBe('Could not fetch data');
  });

  it('functions should return new instance', () => {
    let rs = new RequestState();
    let rs2 = new RequestState();

    expect(rs).toBe(rs);
    expect(rs).not.toBe(rs2);

    expect(rs.success({})).not.toBe(rs);
  });  

  it('should create new instance with existing state', () => {
    let rs = new RequestState({ isSuccess: true, isError: false });

    expect(rs.isSuccess()).toBe(true);
  });

  it('new state should merge old state', () => {
    const rs = new RequestState({ isSuccess: true, isError: false, data: [1,2] });

    expect(rs.isNotAsked()).toBe(true);
    expect(rs.getData().length).toBe(2);
  });
});