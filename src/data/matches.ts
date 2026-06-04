import { Match } from './types';

export const matches: Match[] = [
  {
    id: 'A1', type: 'Amistoso', date: '10/03/2026', rival: 'Cabaleros', goalsFor: 4, goalsAgainst: 2, outcome: 'V',
    lineup: ['Luisfe', 'Santi Ferretti', 'Pato Fernández', 'Benja Flores', 'Jose Ferretti', 'Pibe Valverde', 'Toli', 'Diego Molina', 'Gabo Mazuela', 'Juan Ballas', 'Vicente Ballas'],
    bench:  ['Daniel Vargas', 'Benja Lathrop', 'Benja Romo', 'Pedro Córdova', 'Gregorio Saavedra', 'Alvaro Aliaga'],
  },
  {
    id: 'A2', type: 'Amistoso', date: '?', rival: 'Kuramen', goalsFor: 6, goalsAgainst: 0, outcome: 'V',
    lineup: ['Luisfe', 'Santi Ferretti', 'Pelao Abujatum', 'Daniel Vargas', 'Jose Ferretti', 'Pibe Valverde', 'Toli', 'Diego Molina', 'Maximiliano Rebolledo', 'Gabo Mazuela', 'Juan Ballas'],
    bench:  ['Borja Patrón', 'Benja Flores', 'Benja Lathrop', 'Benja Romo', 'Pedro Córdova', 'Sebastián Martinez', 'Gregorio Saavedra', 'Ponkio Romo'],
  },
  {
    id: 'A3', type: 'Amistoso', date: '?', rival: 'Anglosajon', goalsFor: 3, goalsAgainst: 3, outcome: 'E',
    lineup: ['Luisfe', 'Borja Patrón', 'Pelao Abujatum', 'Pato Fernández', 'Pibe Valverde', 'Toli', 'Diego Molina', 'Pedro Córdova', 'Gabo Mazuela', 'Gregorio Saavedra', 'Vicente Ballas'],
    bench:  ['Daniel Vargas', 'Benja Romo', 'Lucas Vargas'],
  },
  {
    id: '1', type: 'Liga', date: '31/03/2026', rival: 'Brokakochis', goalsFor: 3, goalsAgainst: 0, outcome: 'V',
    lineup: ['Luisfe', 'Borja Patrón', 'Pelao Abujatum', 'Pato Fernández', 'Daniel Vargas', 'Jose Ferretti', 'Benja Romo', 'Pibe Valverde', 'Toli', 'Diego Molina', 'Pedro Córdova'],
    bench:  ['Exequiel Vargas', 'Benja Lathrop', 'Maximiliano Rebolledo', 'Sebastián Martinez', 'Ponkio Romo', 'Lucas Vargas', 'Nico Barriga'],
  },
  {
    id: '2', type: 'Liga', date: '08/04/2026', rival: 'Cabaleros', goalsFor: 3, goalsAgainst: 1, outcome: 'V',
    lineup: ['Luisfe', 'Borja Patrón', 'Pelao Abujatum', 'Pato Fernández', 'Daniel Vargas', 'Jose Ferretti', 'Pibe Valverde', 'Toli', 'Diego Molina', 'Maximiliano Rebolledo', 'Pedro Córdova'],
    bench:  ['Exequiel Vargas', 'Benja Lathrop', 'Benja Romo', 'Sebastián Martinez', 'Gregorio Saavedra', 'Juan Ballas', 'Cristóbal Dib', 'Ponkio Romo', 'Nico Barriga'],
  },
  {
    id: '3', type: 'Liga', date: '14/04/2026', rival: 'Moreno Bello', goalsFor: 4, goalsAgainst: 0, outcome: 'V',
    lineup: ['Luisfe', 'Santi Ferretti', 'Borja Patrón', 'Pelao Abujatum', 'Daniel Vargas', 'Jose Ferretti', 'Pibe Valverde', 'Diego Molina', 'Pedro Córdova', 'Juan Ballas', 'Ponkio Romo'],
    bench:  ['Exequiel Vargas', 'Benja Romo', 'Toli', 'Lucas Vargas', 'Nico Barriga'],
  },
  {
    id: '4', type: 'Liga', date: '21/04/2026', rival: 'Newen', goalsFor: 3, goalsAgainst: 1, outcome: 'V',
    lineup: ['Luisfe', 'Pelao Abujatum', 'Daniel Vargas', 'Toli', 'Diego Molina', 'Maximiliano Rebolledo', 'Sebastián Martinez', 'Gregorio Saavedra', 'Fercho López', 'Juan Ballas', 'Ponkio Romo'],
    bench:  ['Santi Ferretti', 'Borja Patrón', 'Benja Flores', 'Benja Lathrop', 'Benja Romo', 'Pibe Valverde', 'Pedro Córdova', 'Cristóbal Dib', 'Lucas Vargas', 'Nico Barriga'],
  },
  {
    id: '5', type: 'Liga', date: '28/04/2026', rival: 'Instituto', goalsFor: 4, goalsAgainst: 1, outcome: 'V',
    lineup: ['Luisfe', 'Borja Patrón', 'Pelao Abujatum', 'Benja Flores', 'Daniel Vargas', 'Jose Ferretti', 'Pibe Valverde', 'Toli', 'Pedro Córdova', 'Juan Ballas', 'Ponkio Romo'],
    bench:  ['Exequiel Vargas', 'Benja Lathrop', 'Benja Romo', 'Diego Molina', 'Sebastián Martinez', 'Gregorio Saavedra', 'Lucas Vargas', 'Nico Barriga'],
  },
  {
    id: 'CC1', type: 'Copa', date: '01/05/2026', rival: 'Socios UC', goalsFor: 6, goalsAgainst: 2, outcome: 'V',
    lineup: ['Luisfe', 'Pelao Abujatum', 'Daniel Vargas', 'Jose Ferretti', 'Benja Romo', 'Pibe Valverde', 'Toli', 'Maximiliano Rebolledo', 'Pedro Córdova', 'Sebastián Martinez', 'Juan Ballas'],
    bench:  ['Exequiel Vargas', 'Santi Ferretti', 'Diego Molina', 'Gabo Mazuela', 'Nico Barriga', 'Mirri Lihn', 'Benja Abuja'],
  },
  {
    id: '6', type: 'Liga', date: '05/05/2026', rival: 'Cruzeños', goalsFor: 2, goalsAgainst: 2, outcome: 'E',
    lineup: ['Luisfe', 'Borja Patrón', 'Pelao Abujatum', 'Benja Flores', 'Daniel Vargas', 'Jose Ferretti', 'Pibe Valverde', 'Toli', 'Pedro Córdova', 'Juan Ballas', 'Nico Barriga'],
    bench:  ['Benja Lathrop', 'Benja Romo', 'Diego Molina', 'Sebastián Martinez', 'Gabo Mazuela', 'Fercho López'],
  },
  {
    id: '7', type: 'Liga', date: '12/05/2026', rival: 'Anglosajon', goalsFor: 2, goalsAgainst: 0, outcome: 'V',
    lineup: ['Luisfe', 'Borja Patrón', 'Pelao Abujatum', 'Benja Flores', 'Daniel Vargas', 'Benja Romo', 'Pibe Valverde', 'Toli', 'Pedro Córdova', 'Gabo Mazuela', 'Juan Ballas'],
    bench:  ['Santi Ferretti', 'Pato Fernández', 'Benja Lathrop', 'Diego Molina', 'Maximiliano Rebolledo', 'Sebastián Martinez', 'Gregorio Saavedra', 'Fercho López', 'Ponkio Romo', 'Nico Barriga'],
  },
  {
    id: '8', type: 'Liga', date: '?', rival: 'Corderos', goalsFor: 4, goalsAgainst: 2, outcome: 'V',
    lineup: ['Borja Patrón', 'Pato Fernández', 'Daniel Vargas', 'Jose Ferretti', 'Benja Lathrop', 'Pibe Valverde', 'Toli', 'Maximiliano Rebolledo', 'Gabo Mazuela', 'Lucas Vargas', 'Nico Barriga'],
    bench:  ['Exequiel Vargas', 'Santi Ferretti', 'Pelao Abujatum', 'Benja Flores', 'Diego Molina', 'Sebastián Martinez', 'Juan Ballas', 'Ponkio Romo', 'Alvaro Aliaga'],
  },
  {
    id: 'CC2', type: 'Copa', date: '?', rival: 'Flamencos', goalsFor: 4, goalsAgainst: 0, outcome: 'V',
    lineup: ['Luisfe', 'Pelao Abujatum', 'Pato Fernández', 'Daniel Vargas', 'Toli', 'Maximiliano Rebolledo', 'Pedro Córdova', 'Gabo Mazuela', 'Fercho López', 'Juan Ballas', 'Cristóbal Dib'],
    bench:  ['Exequiel Vargas', 'Santi Ferretti', 'Jose Ferretti', 'Benja Lathrop', 'Pibe Valverde', 'Diego Molina', 'Sebastián Martinez', 'Ponkio Romo', 'Alvaro Aliaga', 'Nico Barriga'],
  },
];
