import React from 'react';
import { render, screen } from '@testing-library/react';
import Blog from '../pages/Blog.jsx';
import Footer from '../components/Footer.jsx';

describe('Blog Component', () => {
  it('renderiza artículos principales y headings', () => {
    render(React.createElement(Blog));
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('links externos tienen href correcto', () => {
    render(React.createElement(Blog));
    const link1 = screen.queryByRole('link', { name: /frutas de temporada/i }) || screen.queryByText(/Ver.*frutas.*temporada/i);
    expect(link1).not.toBeNull();
    if (link1) expect(link1.getAttribute('href')).toBe('https://www.odepa.gob.cl/precios/mejores-alimentos-de-temporada');

    const link2 = screen.queryByRole('link', { name: /beneficios.*orgánico|beneficios.*organicos/i }) || screen.queryByText(/Ver.*beneficios.*organicos?/i);
    expect(link2).not.toBeNull();
    if (link2) expect(link2.getAttribute('href')).toBe('https://www.tuasaude.com/es/que-son-los-alimentos-organicos/');
  });

  it('footer correcto (componente Footer)', () => {
    render(React.createElement(Footer));
    // usar queryAllByText y comprobar longitud para múltiples coincidencias
    const footerMatches = screen.queryAllByText(/huerto\s*hogar/i);
    expect(footerMatches.length).toBeGreaterThan(0);

    const yearMatches = screen.queryAllByText(/20(2|1)\d/);
    expect(yearMatches.length).toBeGreaterThan(0);
  });
});