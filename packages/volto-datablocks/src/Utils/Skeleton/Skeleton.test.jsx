import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders a placeholder line with the given width', () => {
    const { container } = render(<Skeleton width="120px" />);

    const skeleton = container.querySelector('.dcv-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('width: 120px');
    expect(container.querySelector('.dcv-skeleton-line')).toBeInTheDocument();
  });
});
