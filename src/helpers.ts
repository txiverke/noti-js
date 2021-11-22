import SETTINGS from './settings';

const POSITIONS = [
  'top',
  'top_left',
  'top_right',
  'bottom',
  'bottom_left',
  'bottom_right',
];

const ANIMATION_SIZE = 10;

export function setDOM(
  element: HTMLElement,
  styles?: { [key: string]: string | number } | null,
  attrs?: { [key: string]: string } | null,
) {
  for (let key in styles) {
    // @ts-ignore
    element.style[key] = styles[key];
  }

  for (let key in attrs) {
    element.setAttribute(key, attrs[key]);
  }

  return element;
}

export function setPosition(position: string) {
  if (!POSITIONS.includes(position)) {
    throw new Error(`Position value must be: ${POSITIONS.join(', ')}.`);
  }

  let currentPosition = {} as { [key: string]: string | number };
  const positions_values = position.split('_');

  for (let key of positions_values) {
    currentPosition[key] = 0;
  }

  return positions_values.length === 1
    ? { ...currentPosition, ...SETTINGS.styles.centered }
    : currentPosition;
}

export function setTranslate(effect: string, position: string) {
  switch (position) {
    case 'top':
      return effect === 'in' ? [0, ANIMATION_SIZE] : [0, -ANIMATION_SIZE];
    case 'bottom':
      return effect === 'in' ? [0, -ANIMATION_SIZE] : [0, ANIMATION_SIZE];
    case 'top_right':
    case 'bottom_right':
      return effect === 'in' ? [-ANIMATION_SIZE, 0] : [ANIMATION_SIZE, 0];
    case 'top_left':
    case 'bottom_left':
      return effect === 'in' ? [ANIMATION_SIZE, 0] : [-ANIMATION_SIZE, 0];
    default:
      return [0, 0];
  }
}
