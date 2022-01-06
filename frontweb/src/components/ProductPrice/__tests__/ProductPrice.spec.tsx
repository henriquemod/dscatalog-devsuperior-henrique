import { render, screen } from '@testing-library/react';
import ProductPrice from '..';

test('should render ProductPrice', () => {
  const price = 20.5;

  render(<ProductPrice price={price} />);

  expect(screen.getByText('R$')).toBeInTheDocument();
  expect(screen.getByText('20,50')).toBeInTheDocument();
});
