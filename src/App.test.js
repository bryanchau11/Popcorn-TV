import { render, screen } from '@testing-library/react';
import App from './App';

test('renders searchbar', () => {
  render(<App />);
  const buttonElement = screen.getByText("Search");
  expect(buttonElement).toBeInTheDocument();
});

test('renders movies', () => {
  render(<App />);
  const movieElement1 = screen.getByText("RELEASE DATE");
  const movieElement2 = screen.getByText("POPULARITY");
  expect(movieElement1).toBeInTheDocument();
  expect(movieElement2).toBeInTheDocument();
});

test('renders sidebar', () => {
  render(<App />);
  const sidebarElement1 = screen.getByText(/Popular Movies/i);
  const sidebarElement2 = screen.getByText(/Top Rated Movies/i);
  const sidebarElement3 = screen.getByText(/Contact/i);
  expect(sidebarElement1).toBeInTheDocument();
  expect(sidebarElement2).toBeInTheDocument();
  expect(sidebarElement3).toBeInTheDocument();
});
