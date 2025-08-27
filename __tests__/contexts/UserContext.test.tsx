import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserContext } from '../../app/contexts/UserContext';

function ShowUsername() {
  const user = React.useContext(UserContext);
  return <div data-testid="name">{user?.username || 'N/A'}</div>;
}

describe('UserContext', () => {
  it('provides user through context', () => {
    render(
      <UserContext.Provider value={{ _id: '1', username: 'alice', avatar: 'a' }}>
        <ShowUsername />
      </UserContext.Provider>
    );

    expect(screen.getByTestId('name').textContent).toBe('alice');
  });
});


