import { IconType } from 'react-icons';
import { HiUsers } from 'react-icons/hi2';
import { MdAddBox } from 'react-icons/md';

/**
 * Interface for a sidebar button.
 * @interface ISidebarButton
 */
interface ISidebarButton {
  /** Icon for the button */
  icon: IconType;

  /** Label for the button */
  label: string;
}

/**
 * Array of sidebar buttons.
 * @type {ISidebarButton[]}
 */
const sidebarButtons: ISidebarButton[] = [
  { icon: MdAddBox, label: 'Add' },
  { icon: HiUsers, label: 'Users' },
];

export default sidebarButtons;
