
// Semantic-UI has some awkward situations where the typing is a bool
// but it actually wants a 'true' or 'false' string
export const BoolStrings = {
    true: 'true' as any as boolean,
    false: 'false' as any as boolean,
};