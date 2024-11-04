export enum TAB_KEYS {
    quickstart = 0,
    keybindings = 1,
}

export type Keybinding = {
    category: string;
    key: string;
    description: string;
};
